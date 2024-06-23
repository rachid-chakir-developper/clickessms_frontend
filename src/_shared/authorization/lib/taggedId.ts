export interface TaggedId<ET extends string> {
  type: ET;
  id: number | string;
}

export function serializeTaggedId(taggedId: TaggedId<string>): string {
  return `${taggedId.type}#${taggedId.id}`;
}
