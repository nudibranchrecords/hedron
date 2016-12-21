let lastId = 0;

export default function(prefix) {
    lastId++;
    return `${prefix}${lastId}`;
}