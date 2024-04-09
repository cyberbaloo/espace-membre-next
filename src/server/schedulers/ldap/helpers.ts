import diff from "microdiff";

export interface GetDiffResult<Model> {
    added: Model[];
    removed: Model[];
    updated: Model[];
    unchanged: Model[];
}

export function getDiff<
    Model extends Record<ReferenceProperty, any>,
    ReferenceProperty extends string | number | symbol
>(
    before: Map<ReferenceProperty, Model>,
    after: Map<ReferenceProperty, Model>
): GetDiffResult<Model> {
    const result: GetDiffResult<Model> = {
        added: [],
        removed: [],
        unchanged: [],
        updated: [],
    };

    after.forEach((afterModel, afterModelReference) => {
        const sameBeforeReferenceModel = before.get(afterModelReference);

        if (sameBeforeReferenceModel) {
            const beforeAfterModelDiff = diff(
                sameBeforeReferenceModel,
                afterModel
            );

            // `microdiff` won't return if unchange, so we can rely on the diff length to detect any change
            if (beforeAfterModelDiff.length > 0) {
                result.updated.push(afterModel);
            } else {
                result.unchanged.push(afterModel);
            }
        } else {
            result.added.push(afterModel);
        }
    });

    before.forEach((beforeModel, beforeModelReference) => {
        if (!after.has(beforeModelReference)) {
            result.removed.push(beforeModel);
        }
    });

    return result;
}

export function formatDiffResultLog<Model>(
    result: GetDiffResult<Model>
): string {
    return `added: ${result.added.length} | removed: ${result.removed.length} | updated: ${result.updated.length} | unchanged: ${result.unchanged.length}`;
}
