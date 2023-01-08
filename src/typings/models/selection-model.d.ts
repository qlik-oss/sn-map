declare interface SelectionToolbar {
  getActiveSelectionType(): string | undefined;
  reset?(): void;
}
