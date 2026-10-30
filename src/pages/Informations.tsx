import { Loading } from "@/components/Loading";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useApi } from "@/hooks/useApi";
import { usePostApi } from "@/hooks/usePostApi";
import { infosApi } from "@/service/userApi";
import { Bookmark, Edit, Info, Plus, Trash2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ErrorMessage } from "@/components/ErrorMessage";
import { IconTitle } from "@/components/ui/IconTitle";
import { InfoSection } from "@/components/ui/InfoSection";
import { Form } from "@/components/ui/Form";
import { ContentInput } from "@/components/ui/ContentInput";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useIsOwner } from "@/hooks/userRole";
import { Textarea } from "@/components/ui/Textarea";
import { useUser } from "@/userContext";
import { LangBadge } from "@/components/ui/LangBadge";
import { AccordionCard } from "@/components/ui/AccordionCards";
import { ReOrder } from "@/components/ui/ReOrder";
import { useTranslation } from "@/hooks/useTranslation";

interface Information {
	section_id: string;
	id: string | null;
	title_i18n: Record<string, string> | null;
	description_i18n: Record<string, string> | null;
	img_url: string | null;
	sort_order: number;
}

export const InformationPage = () => {
	const t = useTranslation();
	const { lang } = useUser();
	const [openId, setOpenId] = useState<string | null>(null);
	const { id } = useParams();

	const { data, error, loading, refresh } = useApi<Information[]>(() =>
		infosApi(id),
	);
	const { post, errorPost, loadingPost } = usePostApi();

	const [titleI18n, setTitleI18n] = useState<Record<string, string>>({});
	const [descriptionI18n, setDescriptionI18n] = useState<
		Record<string, string>
	>({});
	const [imgUrl, setImgUrl] = useState("");
	const [editingInfo, setEditingInfo] = useState<Information | null>(null);

	const [items, setItems] = useState<Information[]>([]);

	useEffect(() => {
		setItems(data ?? []);
	}, [data]);

	const resetForm = () => {
		setTitleI18n({});
		setDescriptionI18n({});
		setImgUrl("");
	};

	const handleInfos = async (e: React.FormEvent, close: () => void) => {
		e.preventDefault();
		await post(
			"/api/infos",
			{ sectionId: data?.[0]?.section_id, titleI18n, descriptionI18n, imgUrl },
			{
				close: () => {
					resetForm();
					close();
				},
				refresh,
			},
		);
	};

	const handleEdit = async (e: React.FormEvent, close: () => void) => {
		e.preventDefault();
		await post(
			"/api/infos",
			{ id: editingInfo?.id, titleI18n, descriptionI18n, imgUrl },
			{
				close: () => {
					resetForm();
					close();
				},
				refresh,
				method: "PUT",
			},
		);
	};

	const handleDelete = async (infoId: string) => {
		await post("/api/infos", { id: infoId }, { refresh, method: "DELETE" });
	};

	const handleReorder = async (newItems: Information[]) => {
		setItems(newItems);
		await post(
			"/api/infos/reorder",
			{
				order: newItems.map((item, index) => ({
					id: item.id,
					sort_order: index,
				})),
			},
			{ method: "PUT" },
		);
	};
	console.log(data);
	const isOwner = useIsOwner();

	if (loading) return <Loading />;
	if (error) return <ErrorMessage />;

	return (
		<>
			<div className="p-3">
				{!items.length ? (
					<div className="h-full flex justify-center items-center mt-20">
						<IconTitle
							title="Renseignez vos premières informations pratiques"
							sublabel="Exemples : Où trouver le café, les poubelles..."
							icon={Info}
						/>
					</div>
				) : (
					<>
						<IconTitle title={t.practical_info.title} icon={Info} />
						<InfoSection title={t.practical_info.list}>
							<div className="flex flex-col gap-3">
								<ReOrder items={items} onReorder={handleReorder}>
									{(info, dragProps) => (
										<div
											{...(dragProps as
												| React.HTMLAttributes<HTMLDivElement>
												| undefined)}
										>
											<AccordionCard
												icon={Bookmark}
												title={
													info.title_i18n?.[lang] ??
													Object.values(info.title_i18n ?? {})[0]
												}
												badge={
													<LangBadge
														i18nObject={info.title_i18n ?? {}}
														currentLang={lang}
													/>
												}
												isOpen={openId === info.id}
												onToggle={() =>
													setOpenId(openId === info.id ? null : info.id)
												}
												actions={
													isOwner && (
														<>
															<Dialog
																trigger={
																	<button
																		type="button"
																		className="p-2 rounded-lg border bg-white text-gray-500 hover:text-violet-600 hover:bg-violet-50"
																		onClick={() => {
																			setEditingInfo(info);
																			setTitleI18n({
																				...(info.title_i18n ?? {}),
																				[lang]: info.title_i18n?.[lang] ?? "",
																			});
																			setDescriptionI18n({
																				...(info.description_i18n ?? {}),
																				[lang]:
																					info.description_i18n?.[lang] ?? "",
																			});
																			setImgUrl(info.img_url ?? "");
																		}}
																	>
																		<Edit size={14} />
																	</button>
																}
																title="Modifier l'information"
															>
																{({ close }) => (
																	<Form
																		onSubmit={(e) => handleEdit(e, close)}
																		className="p-4 space-y-4"
																	>
																		<ContentInput>
																			<Label htmlFor="title">Titre</Label>
																			<Input
																				value={titleI18n[lang] ?? ""}
																				onChange={(e) =>
																					setTitleI18n({
																						...titleI18n,
																						[lang]: e.target.value,
																					})
																				}
																			/>
																		</ContentInput>
																		<ContentInput>
																			<Label htmlFor="description">
																				Description
																			</Label>
																			<Textarea
																				value={descriptionI18n[lang] ?? ""}
																				onChange={(e) =>
																					setDescriptionI18n({
																						...descriptionI18n,
																						[lang]: e.target.value,
																					})
																				}
																			/>
																		</ContentInput>
																		<ContentInput>
																			<Label htmlFor="img">Photo</Label>
																			<ImageUpload
																				bgImage={
																					imgUrl
																						? `/images/${imgUrl}`
																						: undefined
																				}
																				className="h-40"
																				onUploadSuccess={(name) =>
																					setImgUrl(name)
																				}
																			/>
																		</ContentInput>
																		{errorPost && (
																			<p className="text-red-500 text-sm">
																				{errorPost}
																			</p>
																		)}
																		<Button
																			type="submit"
																			disabled={loadingPost}
																			className="w-full"
																		>
																			{loadingPost
																				? "Enregistrement..."
																				: "Enregistrer"}
																		</Button>
																	</Form>
																)}
															</Dialog>

															<button
																type="button"
																onClick={() => info.id && handleDelete(info.id)}
																className="p-2 rounded-lg border text-gray-500 hover:text-red-600 hover:bg-red-50"
															>
																<Trash2 size={14} />
															</button>
														</>
													)
												}
											>
												<span className="whitespace-pre-line">
													{info.description_i18n?.[lang] ?? ""}
												</span>

												{info.img_url && (
													<img
														src={`/images/${info.img_url}`}
														alt={info.title_i18n?.[lang] ?? ""}
														className="mt-3 w-full max-h-44 object-cover rounded-lg border"
													/>
												)}
											</AccordionCard>
										</div>
									)}
								</ReOrder>
							</div>
						</InfoSection>
					</>
				)}
			</div>

			<Dialog
				trigger={
					<Button
						size="big"
						icon={<Plus />}
						variant="absolute"
						onClick={resetForm}
					>
						Ajouter
					</Button>
				}
				title="Informations"
			>
				{({ close }) => (
					<Form
						onSubmit={(e) => handleInfos(e, close)}
						className="p-4 space-y-4"
					>
						<ContentInput>
							<Label htmlFor="sujet">Sujet</Label>
							<Input
								placeholder="Café"
								value={titleI18n[lang] ?? ""}
								onChange={(e) =>
									setTitleI18n({ ...titleI18n, [lang]: e.target.value })
								}
							/>
						</ContentInput>
						<ContentInput>
							<Label htmlFor="Détail">Détail</Label>
							<Textarea
								placeholder="Description..."
								value={descriptionI18n[lang] ?? ""}
								onChange={(e) =>
									setDescriptionI18n({
										...descriptionI18n,
										[lang]: e.target.value,
									})
								}
							/>
						</ContentInput>
						<ContentInput>
							<Label htmlFor="image">Photo</Label>
							<ImageUpload onUploadSuccess={(name) => setImgUrl(name)} />
						</ContentInput>
						{errorPost && <p className="text-red-500 text-sm">{errorPost}</p>}
						<Button type="submit" disabled={loadingPost} className="w-full">
							{loadingPost ? "Enregistrement..." : "Enregistrer"}
						</Button>
					</Form>
				)}
			</Dialog>
		</>
	);
};
