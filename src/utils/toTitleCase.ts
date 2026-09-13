export const toTitleCase = (sentence: string) => {
    return sentence.toLowerCase().split(' ').map(word => {
        // Capitalize the first letter of each word
        // and convert the rest to lowercase
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
};