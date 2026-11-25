import ts from 'typescript';

export function zodDiscriminatorEdit(node, source) {
  if (
    !ts.isTypeReferenceNode(node) ||
    !/(?:^|\.)ZodDiscriminatedUnion$/u.test(node.typeName.getText(source)) ||
    (node.typeArguments?.length ?? 0) < 2
  ) {
    return;
  }
  const [options, discriminator] = node.typeArguments;
  if (
    node.typeArguments.length !== 2 ||
    !ts.isLiteralTypeNode(discriminator) ||
    !ts.isStringLiteral(discriminator.literal)
  ) {
    throw new Error(`Unexpected Zod union shape in ${source.fileName}`);
  }
  const key = discriminator.getText(source);
  return [
    options.end,
    node.end,
    `> & { def: { discriminator: ${key} }; _zod: { def: { discriminator: ${key} } } }`,
  ];
}
