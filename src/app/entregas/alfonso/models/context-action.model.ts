export interface ContextAction<TPayload = unknown> {
  id: string;
  label: string;
  icon: string;
  payload?: TPayload;
}
