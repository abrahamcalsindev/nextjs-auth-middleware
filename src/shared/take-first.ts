export function takeFirst(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value.length > 0 &&
      typeof value[0] === "string" &&
      value[0].length > 0
      ? value[0]
      : undefined;
  }

  return typeof value === "string" && value.length > 0 ? value : undefined;
}
