import { Entity, Type } from '@graphprotocol/hypergraph';

export class Dapp extends Entity.Class<Dapp>('Dapp')({
  name: Type.String,
  description: Type.optional(Type.String),
  category: Type.optional(Type.String),
  contract: Type.optional(Type.String),
  rating: Type.optional(Type.Number),
  active: Type.optional(Type.Boolean),
  image: Type.optional(Type.String),
  // legacy/optional links
  xUrl: Type.optional(Type.String),
  githubUrl: Type.optional(Type.String),
}) {}
