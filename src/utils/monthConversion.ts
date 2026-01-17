const monthsNumbers = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
};

const monthsNames = {
    '1': 'january', 
    '2': 'february', 
    '3': 'march', 
    '4': 'april', 
    '5': 'may', 
    '6': 'june', 
    '7': 'july', 
    '8': 'august', 
    '9': 'september', 
    '10': 'october',
    '11': 'november',
    '12': 'december',
}

export const monthNameToNumber = (monthName) => {
    return monthsNumbers[monthName.toLowerCase()]
}
    
export const monthNumberToName = (monthNumber) => {
return monthsNames[String(monthNumber)]
}