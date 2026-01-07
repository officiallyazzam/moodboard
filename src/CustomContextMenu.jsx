import {
	DefaultContextMenu,
	TldrawUiMenuGroup,
	TldrawUiMenuSubmenu,
	TldrawUiMenuActionItem,
	CopyAsMenuGroup,
	EditMenuSubmenu,
	ArrangeMenuSubmenu,
	ReorderMenuSubmenu,
	MoveToPageMenu,
	CursorChatItem,
	SelectAllMenuItem,
	ClipboardMenuGroup,
	useEditor,
	useValue,
	useShowCollaborationUi
} from 'tldraw'

function CustomContextMenuContent() {
	const editor = useEditor()
    const showCollaborationUi = useShowCollaborationUi()

	const selectToolActive = useValue(
		"isSelectToolActive",
		() => editor.getCurrentToolId() === "select",
		[editor]
	)
	const isSinglePageMode = useValue("isSinglePageMode", () => editor.options.maxPages <= 1, [
		editor
	])

	if (!selectToolActive) return null

	return (
		<>
            {showCollaborationUi && <CursorChatItem />}
			<TldrawUiMenuGroup id="modify">
				<EditMenuSubmenu />
				<ArrangeMenuSubmenu />
				<ReorderMenuSubmenu />
				{!isSinglePageMode && <MoveToPageMenu />}
			</TldrawUiMenuGroup>
			<ClipboardMenuGroup />
			<TldrawUiMenuGroup id="conversions">
                <CopyAsMenuGroup />
                <TldrawUiMenuSubmenu id="export-as" label="context-menu.export-as" size="small">
                    <TldrawUiMenuGroup id="export-as-group">
                        <TldrawUiMenuActionItem actionId="export-as-svg" />
                        <TldrawUiMenuActionItem actionId="export-as-png" />
                        <TldrawUiMenuActionItem actionId="export-as-pdf" />
                    </TldrawUiMenuGroup>
                </TldrawUiMenuSubmenu>
            </TldrawUiMenuGroup>
			<TldrawUiMenuGroup id="select-all">
				<SelectAllMenuItem />
			</TldrawUiMenuGroup>
		</>
	)
}

export function CustomContextMenu(props) {
	return (
		<DefaultContextMenu {...props}>
			<CustomContextMenuContent />
		</DefaultContextMenu>
	)
}
