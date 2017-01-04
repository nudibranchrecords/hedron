let lastId = Date.now();

export default function(prefix) {
    lastId++;
    return `${prefix}${lastId}`;
}