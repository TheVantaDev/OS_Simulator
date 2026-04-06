
const args = process.argv.slice(2);

const hashString = (str: string) => {
    let hash = 3770;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
};

if (args.length === 0) {
    console.log('Usage: npx ts-node .scripts/generate_hash.ts <string1> <string2> ...');
    console.log('Example: npx ts-node .scripts/generate_hash.ts "aurora-os-js" "Cătălin-Robert Drăgoiu" "AGPL-3.0"');
    process.exit(0);
}

args.forEach(arg => {
    const hash = hashString(arg);
    console.log(`"${arg}" -> ${hash}`);
});