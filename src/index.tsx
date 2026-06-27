import { serve } from "bun";
import index from "./index.html";
import { sql } from "../backend/client";
import jwt from "jsonwebtoken";
import { getCookieServer } from "./utilis/cookies";
import { Resend } from "resend";
import { Email } from "./components/ui/EmailRegister";
import { verifyAuth } from "./middleware";


const unauthorized = () =>
  Response.json({ error: "Accès refusé" }, { status: 401 });

const isProduction = process.env.NODE_ENV === "production";
const secure = isProduction ? "; Secure" : "";
const cookieFlags = `HttpOnly; Path=/; Max-Age=604800; SameSite=Lax${secure}`;
const cookieFlagsLong = `HttpOnly; Path=/; Max-Age=2592000; SameSite=Lax${secure}`;

const server = serve({
  routes: {
    "/api/upload": {
      async POST(req: Request) {
        if (!verifyAuth(req)) return unauthorized()
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const fileName = formData.get("fileName") as string;

        if (!file || !fileName) {
          return Response.json({ error: "Fichier ou nom manquant" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        await Bun.write(`./public/images/${fileName}`, buffer);

        return Response.json({ ok: true });
      },
    },
    "/images/*": async (req) => {
      const url = new URL(req.url);
      const filePath = `./public${url.pathname}`;
      const file = Bun.file(filePath);

      if (await file.exists()) {
        return new Response(file);
      }
      return new Response("Not found", { status: 404 });
    },
    "/*": index,
    "/api/auth/logout": {
      async POST() {
        const headers = new Headers({ "Content-Type": "application/json" });
        headers.append("Set-Cookie", `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure}`);
        headers.append("Set-Cookie", `userId=; Path=/; Max-Age=0; SameSite=Lax${secure}`);
        headers.append("Set-Cookie", `propertyId=; Path=/; Max-Age=0; SameSite=Lax${secure}`);
        headers.append("Set-Cookie", `clientId=; Path=/; Max-Age=0; SameSite=Lax${secure}`);
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
      }
    },
    "/api/auth/login": {
      async POST(req) {
        const body = await req.json();

        if (!body.email || !body.password) {
          return Response.json({ error: "Champs manquants" }, { status: 400 });
        }

        const [user] = await sql`
          SELECT id, email, name, role, password_hash
          FROM users
          WHERE email = ${body.email}
        `;

        if (!user) {
          return Response.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
        }

        const valid = await Bun.password.verify(body.password, user.password_hash);

        if (!valid) {
          return Response.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
        }

        const { password_hash, ...safeUser } = user;

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          return Response.json({ error: "Server configuration error" }, { status: 500 });
        }

        const token = jwt.sign(
          { id: user.id, role: user.role },
          jwtSecret,
          { expiresIn: "7d" }
        );

        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.append("Set-Cookie", `token=${token}; ${cookieFlags}`);
        headers.append("Set-Cookie", `userId=${user.id}; Path=/; Max-Age=604800; SameSite=Lax${secure}`);

        return new Response(JSON.stringify(safeUser), { status: 200, headers });
      }
    },
    "/api/auth/scan": {
      async GET(req) {
        const token = new URL(req.url).searchParams.get("token")
        if (!token) return Response.json({ error: "Token manquant" }, { status: 400 })

        try {
          const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; property_id: string }

          const [client] = await sql`
            SELECT id, name, property_id, is_active
            FROM clients WHERE id = ${payload.id}
          `

          if (!client) return Response.json({ error: "Compte introuvable" }, { status: 404 })
          if (!client.is_active) return Response.json({ error: "Compte désactivé" }, { status: 403 })

          const headers = new Headers({ "Content-Type": "application/json" })
          headers.append("Set-Cookie", `token=${token}; ${cookieFlagsLong}`)
          headers.append("Set-Cookie", `clientId=${client.id}; Path=/; Max-Age=2592000; SameSite=Lax${secure}`)

          return new Response(JSON.stringify(client), { status: 200, headers })
        } catch {
          return Response.json({ error: "Token invalide" }, { status: 401 })
        }
      }
    },
    "/api/auth/me": {
      async GET(req) {
        const token = getCookieServer(req, "token")

        if (!token) {
          return Response.json({ error: "Non authentifié" }, { status: 401 });
        }

        try {
          const jwtSecret = process.env.JWT_SECRET;
          if (!jwtSecret) {
            return Response.json({ error: "Server configuration error" }, { status: 500 });
          }

          const payload = jwt.verify(token, jwtSecret) as { id: string; role?: string; type?: string };

          if (payload.type === "client") {
            const [client] = await sql`
              SELECT id, name, property_id, is_active
              FROM clients WHERE id = ${payload.id}
            `
            if (!client) return Response.json({ error: "Client introuvable" }, { status: 404 });
            if (!client.is_active) return Response.json({ error: "Compte désactivé" }, { status: 403 });

            return Response.json({ ...client, role: "guest" });
          }

          const [user] = await sql`
            SELECT id, email, name, role
            FROM users WHERE id = ${payload.id}
          `;

          if (!user) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });

          return Response.json(user);

        } catch {
          return Response.json({ error: "Token invalide" }, { status: 401 });
        }
      },
    },
    "/api/auth/register": {
      async POST(req) {
        const body = await req.json();

        if (!body.email || !body.password) {
          return Response.json({ error: "Champs manquants" }, { status: 400 });
        }

        const password_hash = await Bun.password.hash(body.password);

        let user;

        try {
          [user] = await sql`
            INSERT INTO users (name, email, password_hash)
            VALUES (${body.name}, ${body.email}, ${password_hash})
            RETURNING id, email, name, role, created_at
          `;

          const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
          );

          const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

          await sql`
            INSERT INTO email_verifications (user_id, token, expires_at)
            VALUES (${user.id}, ${token}, ${expiresAt})
            RETURNING *
          `;
        } catch (e: any) {
          if (e.code === "23505") {
            return Response.json({ error: "Email déjà utilisé" }, { status: 409 });
          }
          return Response.json({ error: "Erreur serveur" }, { status: 500 });
        }

        const resend = new Resend(process.env.RESEND_API);

        const [{ token: verifyToken }] = await sql`
          SELECT token FROM email_verifications WHERE user_id = ${user.id}
        `;

        const { error } = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: "louis.maucourt7@gmail.com",
          subject: "Confirme ton inscription",
          react: <Email url={`${process.env.BASE_URL}/verify?token=${verifyToken}`} />,
        });

        if (error) {
          console.error("❌ Erreur Resend:", JSON.stringify(error, null, 2));
        }

        return Response.json(user);
      }
    },
    "/api/auth/register/token": {
      async POST(req) {
        const body = await req.json()
        const token = body.token

        if (!token) {
          return Response.json({ error: "Token manquant" }, { status: 400 });
        }

        let payload: any;
        try {
          payload = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (e) {
          return Response.json({ error: "Token invalide ou expiré" }, { status: 401 });
        }

        const [verification] = await sql`
          SELECT * FROM email_verifications
          WHERE token = ${token} AND expires_at > NOW()
        `;

        if (!verification) {
          return Response.json({ error: "Token expiré ou déjà utilisé" }, { status: 401 });
        }

        const [user] = await sql`
          SELECT id, email, name, role FROM users WHERE id = ${payload.id}
        `;

        await sql`DELETE FROM email_verifications WHERE token = ${token}`;

        const sessionToken = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET!,
          { expiresIn: "30d" }
        );

        const headers = new Headers({ "Content-Type": "application/json" });
        headers.append("Set-Cookie", `token=${sessionToken}; ${cookieFlagsLong}`);
        headers.append("Set-Cookie", `userId=${user.id}; Path=/; Max-Age=2592000; SameSite=Lax${secure}`);

        return new Response(JSON.stringify(user), { status: 200, headers });
      }
    },
    "/api/users": {
      async GET(req) {
        if (!verifyAuth(req)) return unauthorized()
        const users = await sql`SELECT * FROM users ORDER BY id DESC`;
        return Response.json(users);
      },
      async POST(req) {
        const body = await req.json();

        if (!body.email || !body.password) {
          return Response.json({ error: "Champs manquants" }, { status: 400 });
        }

        const password_hash = await Bun.password.hash(body.password);

        try {
          const [user] = await sql`
            INSERT INTO users (name, email, password_hash)
            VALUES (${body.name}, ${body.email}, ${password_hash})
            RETURNING id, email, name, role, created_at
          `;
          return Response.json(user, { status: 201 });
        } catch (e: any) {
          if (e.code === "23505") {
            return Response.json({ error: "Email déjà utilisé" }, { status: 409 });
          }
          return Response.json({ error: "Erreur serveur" }, { status: 500 });
        }
      },
    },
    "/api/clients": {
      async GET(req) {
        if (!verifyAuth(req)) return unauthorized()
        const propertyId = new URL(req.url).searchParams.get("id")
        const clients = await sql`SELECT * FROM clients WHERE property_id = ${propertyId}`
        return Response.json(clients)
      },
      async POST(req) {
        if (!verifyAuth(req)) return unauthorized()
        const body = await req.json()
        const password_hash = await Bun.password.hash(body.password)

        const [client] = await sql`
          INSERT INTO clients (property_id, name, password_hash)
          VALUES (${body.property_id}, ${body.name}, ${password_hash})
          RETURNING id, name, property_id, is_active, created_at
        `

        const qr_token = jwt.sign(
          { id: client.id, property_id: client.property_id, type: "client" },
          process.env.JWT_SECRET!,
          { expiresIn: "365d" }
        )

        const [clientWithToken] = await sql`
          UPDATE clients SET qr_token = ${qr_token}
          WHERE id = ${client.id}
          RETURNING id, name, property_id, is_active, created_at, qr_token
        `

        return Response.json(clientWithToken, { status: 201 })
      },
      async PUT(req) {
        if (!verifyAuth(req)) return unauthorized()
        const body = await req.json()
        if (body.password) {
          const password_hash = await Bun.password.hash(body.password);
          const [client] = await sql`
            UPDATE clients SET password_hash = ${password_hash}
            WHERE id = ${body.id}
            RETURNING id, name, property_id, is_active, created_at
          `;
          return Response.json(client);
        }
        const [client] = await sql`
          UPDATE clients SET
            name = COALESCE(${body.name ?? null}, name),
            is_active = COALESCE(${body.is_active ?? null}, is_active)
          WHERE id = ${body.id}
          RETURNING id, name, property_id, is_active, created_at
        `
        return Response.json(client)
      },
      async DELETE(req) {
        if (!verifyAuth(req)) return unauthorized()
        const body = await req.json()
        await sql`DELETE FROM clients WHERE id = ${body.id}`
        return Response.json({ ok: true })
      }
    },
    "/api/infos": {
      async GET(req) {
        if (!verifyAuth(req)) return unauthorized()
        const propertyId = new URL(req.url).searchParams.get("id")
        const infos = await sql`
          SELECT 
            sections.id as section_id,
            infos_details.id,
            infos_details.title,
            infos_details.description,
            infos_details.img_url
          FROM sections
          LEFT JOIN infos_details ON infos_details.section_id = sections.id
          WHERE sections.property_id = ${propertyId}
          AND sections.type = 'infos'
        `
        return Response.json(infos)
      },
      async POST(req) {
        if (!verifyAuth(req)) return unauthorized()
        const body = await req.json()
        if (!body.sectionId) {
          return Response.json({ error: "sectionId manquant" }, { status: 400 })
        }
        const [infos] = await sql`
          INSERT INTO infos_details (section_id, title, description, img_url)
          VALUES (${body.sectionId}, ${body.title ?? null}, ${body.description ?? null}, ${body.imgUrl ?? null})
          RETURNING *
        `
        return Response.json(infos)
      },
      async PUT(req) {
        if (!verifyAuth(req)) return unauthorized()
        const body = await req.json()
        const [infos] = await sql`
          UPDATE infos_details
          SET title = ${body.title}, description = ${body.description}, img_url = ${body.imgUrl}
          WHERE id = ${body.id}
          RETURNING *
        `
        return Response.json(infos)
      },
      async DELETE(req) {
        if (!verifyAuth(req)) return unauthorized()
        const body = await req.json()
        await sql`DELETE FROM infos_details WHERE id = ${body.id}`
        return Response.json({ ok: true })
      }
    },
    "/api/wifi": {
      async GET(req) {
        if (!verifyAuth(req)) return unauthorized()
        const bookletId = new URL(req.url).searchParams.get("id")
        const wifi = await sql`
          SELECT wifi_details.*, sections.id as section_id
          FROM sections
          LEFT JOIN wifi_details ON wifi_details.section_id = sections.id
          WHERE sections.property_id = ${bookletId}
          AND sections.type = 'wifi'
        `
        return Response.json(wifi)
      },
      async POST(req) {
        if (!verifyAuth(req)) return unauthorized()
        const body = await req.json()
        const [wifi] = await sql`
          INSERT INTO wifi_details (section_id, network_name, password)
          VALUES (${body.sectionId}, ${body.networkName}, ${body.password})
          ON CONFLICT (section_id) DO UPDATE SET
            network_name = EXCLUDED.network_name,
            password = EXCLUDED.password
          RETURNING *
        `
        return Response.json(wifi)
      }
    },
    "/api/contact": {
      async GET(req) {
        if (!verifyAuth(req)) return unauthorized()
        const bookletId = new URL(req.url).searchParams.get("id")
        const contact = await sql`
          SELECT contacts_details.*, sections.id as section_id
          FROM sections
          LEFT JOIN contacts_details ON contacts_details.section_id = sections.id
          WHERE sections.property_id = ${bookletId}
          AND sections.type = 'contacts'
        `
        return Response.json(contact)
      },
      async POST(req) {
        if (!verifyAuth(req)) return unauthorized()
        const body = await req.json()
        const [contact] = await sql`
          INSERT INTO contacts_details (section_id, name, phone, whatsapp, notes)
          VALUES (${body.sectionId}, ${body.name}, ${body.phone}, ${body.whatsapp}, ${body.notes})
          ON CONFLICT (section_id) DO UPDATE SET
            name = EXCLUDED.name,
            phone = EXCLUDED.phone,
            whatsapp = EXCLUDED.whatsapp,
            notes = EXCLUDED.notes
          RETURNING *
        `
        return Response.json(contact)
      }
    },
    "/api/places": {
      async GET(req) {
        if (!verifyAuth(req)) return unauthorized()
        const propertyId = new URL(req.url).searchParams.get("id")
        const places = await sql`
          SELECT places_details.*, sections.id as section_id
          FROM sections
          LEFT JOIN places_details ON places_details.section_id = sections.id
          WHERE sections.property_id = ${propertyId}
          AND sections.type = 'places'
        `
        return Response.json(places)
      },
      async POST(req) {
        if (!verifyAuth(req)) return unauthorized()
        const body = await req.json()
        const [place] = await sql`
          INSERT INTO places_details (section_id, name, description, category, address, phone, website)
          VALUES (
            ${body.sectionId},
            ${body.name ?? null},
            ${body.description ?? null},
            ${body.category ?? null},
            ${body.address ?? null},
            ${body.phone ?? null},
            ${body.website ?? null}
          )
          RETURNING *
        `
        return Response.json(place)
      },
      async PUT(req) {
        if (!verifyAuth(req)) return unauthorized()
        const body = await req.json()
        const [place] = await sql`
          UPDATE places_details
          SET name = ${body.name}, description = ${body.description}, phone = ${body.phone}, website = ${body.website}
          WHERE id = ${body.id}
          RETURNING *
        `
        return Response.json(place)
      },
      async DELETE(req) {
        if (!verifyAuth(req)) return unauthorized()
        const body = await req.json()
        const [place] = await sql`DELETE FROM places_details WHERE id = ${body.id} RETURNING *`
        return Response.json(place)
      }
    },
    "/api/rules": {
      async GET(req) {
        if (!verifyAuth(req)) return unauthorized()
        const propertyId = new URL(req.url).searchParams.get("id")
        const rules = await sql`
          SELECT rules_details.*, sections.id as section_id
          FROM sections
          LEFT JOIN rules_details ON rules_details.section_id = sections.id
          WHERE sections.property_id = ${propertyId}
          AND sections.type = 'rules'
        `
        return Response.json(rules)
      },
      async POST(req) {
        if (!verifyAuth(req)) return unauthorized()
        const body = await req.json()
        const [rules] = await sql`
          INSERT INTO rules_details (section_id, smoking_allowed, pets_allowed, parties_allowed, additional_rules)
          VALUES (${body.sectionId}, ${body.smokingAllowed}, ${body.petsAllowed}, ${body.partiesAllowed}, ${body.additionalRules})
          ON CONFLICT (section_id) DO UPDATE SET
            smoking_allowed = EXCLUDED.smoking_allowed,
            pets_allowed = EXCLUDED.pets_allowed,
            parties_allowed = EXCLUDED.parties_allowed,
            additional_rules = EXCLUDED.additional_rules
          RETURNING *
        `
        return Response.json(rules)
      }
    },
    "/api/sections": {
      async GET(req) {
        if (!verifyAuth(req)) return unauthorized()
        const propertyId = new URL(req.url).searchParams.get("id")
        const section = await sql`SELECT * FROM sections WHERE sections.property_id = ${propertyId}`
        return Response.json(section)
      },
      async PUT(req) {
        if (!verifyAuth(req)) return unauthorized()
        const body = await req.json()
        const [properties] = await sql`
          UPDATE sections SET is_visible = ${body.isVisible}, sort_order = ${body.sortOrder}
          WHERE id = ${body.id}
          RETURNING *
        `
        return Response.json(properties)
      },
    },
    "/api/staydetails": {
      async GET(req) {
        if (!verifyAuth(req)) return unauthorized()
        const bookletId = new URL(req.url).searchParams.get("id");
        const stay = await sql`
          SELECT stay_details.*, sections.id as section_id
          FROM sections
          LEFT JOIN stay_details ON stay_details.section_id = sections.id
          WHERE sections.property_id = ${bookletId}
          AND sections.type = 'stay'
        `;
        return Response.json(stay);
      },
      async POST(req) {
        if (!verifyAuth(req)) return unauthorized()
        const body = await req.json()
        const [stay] = await sql`
          INSERT INTO stay_details (section_id, checkin, checkout, instructions, instructions_leave, key_access_type, key_access_info)
          VALUES (
            ${body.sectionId},
            ${body.checkIn ?? null},
            ${body.checkOut ?? null},
            ${body.instruction ?? null},
            ${body.instructionLeave ?? null},
            ${body.keyAccessType ?? null},
            ${body.keyInfo ?? null}
          )
          ON CONFLICT (section_id) DO UPDATE SET
            checkin = COALESCE(EXCLUDED.checkin, stay_details.checkin),
            checkout = COALESCE(EXCLUDED.checkout, stay_details.checkout),
            instructions = COALESCE(EXCLUDED.instructions, stay_details.instructions),
            instructions_leave = COALESCE(EXCLUDED.instructions_leave, stay_details.instructions_leave),
            key_access_type = EXCLUDED.key_access_type,
            key_access_info = EXCLUDED.key_access_info
          RETURNING *
        `
        return Response.json(stay)
      }
    },
    "/api/properties": {
      async GET(req) {
        const user = verifyAuth(req)
        if (!user) return unauthorized()
        const userId = (user as any).id

        const properties = await sql`
        SELECT * FROM properties
        WHERE owner_id = ${userId}
        ORDER BY created_at DESC
    `;
        return Response.json(properties);
      },
      async POST(req) {
        const user = verifyAuth(req)
        if (!user) return unauthorized()
        const userId = (user as any).id

        const body = await req.json();
        const [properties] = await sql`
          INSERT INTO properties (owner_id, title, city, address, img_url, description)
          VALUES (${userId}, ${body.title}, ${body.city}, ${body.address}, ${body.imgUrl}, ${body.description})
          RETURNING *
        `;

        await sql`
          INSERT INTO sections(property_id, type, title, sort_order)
          VALUES
            (${properties.id}, 'infos', 'Informations pratiques', 1),
            (${properties.id}, 'wifi', 'Wifi', 2),
            (${properties.id}, 'stay', 'Arrivé et Départ', 3),
            (${properties.id}, 'rules', 'Règles', 4),
            (${properties.id}, 'places', 'Bonnes adresses', 5),
            (${properties.id}, 'contacts', 'Contact', 6)
        `;

        return Response.json(properties);
      },
      async PUT(req) {
        if (!verifyAuth(req)) return unauthorized()
        const body = await req.json()
        const [properties] = await sql`
          UPDATE properties
          SET title = ${body.title}, city = ${body.city}, address = ${body.address}, img_url = ${body.imgUrl}, description = ${body.description}
          WHERE id = ${body.id}
          RETURNING *
        `
        return Response.json(properties)
      },
      async DELETE(req) {
        if (!verifyAuth(req)) return unauthorized()
        const body = await req.json()
        const [properties] = await sql`DELETE FROM properties WHERE properties.id = ${body.id} RETURNING *`
        return Response.json(properties)
      }
    },
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);