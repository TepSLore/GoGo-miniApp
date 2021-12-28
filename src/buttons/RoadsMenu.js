const openBase = () =>
    setPopout(
        <ActionSheet
            onClose={onClose}
            iosCloseItem={
                <ActionSheetItem autoclose mode="cancel">
                    Отменить
                </ActionSheetItem>
            }
            toggleRef={baseTargetRef}
        >
        <ActionSheetItem autoclose>Сохранить в закладках</ActionSheetItem>
        <ActionSheetItem autoclose>Закрепить запись</ActionSheetItem>
        <ActionSheetItem autoclose>Выключить комментирование</ActionSheetItem>
        <ActionSheetItem autoclose>Закрепить запись</ActionSheetItem>
        <ActionSheetItem autoclose mode="destructive">
            Удалить запись
        </ActionSheetItem>
        </ActionSheet>
    );

export default openBase