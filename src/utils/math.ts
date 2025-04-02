/**
 * Checks if a number is a prime number with optimized performance.
 * @param num - The number to check.
 * @returns True if the number is prime, otherwise false.
 */
export function isPrime(num: number): boolean {
    if (num <= 1) return false;
    if (num === 2 || num === 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;

    const sqrtNum = Math.sqrt(num);
    for (let i = 5; i <= sqrtNum; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }

    return true;
}