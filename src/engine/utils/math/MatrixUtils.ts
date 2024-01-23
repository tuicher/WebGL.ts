export function printMatrix4x4(array: Float32Array): void {
    if (array.length !== 16) {
        console.error('array must have exactly 16 elements.');
        return;
    }

    for (let i = 0; i < 4; i++) {
        const row = array.slice(i * 4, (i + 1) * 4);
        console.log(`| ${row.join(' | ')} |`);
    }
}