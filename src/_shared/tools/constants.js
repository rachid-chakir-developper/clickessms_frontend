export const GOOGLE = {
    MAPS_API_KEY : 'AIzaSyACunnNRX8tSlQkdgC6AJRlPL5WhRQxjL0',
}

export const STEP_TYPES =  {
    BEFORE : "BEFORE",
    IN_PROGRESS : "IN_PROGRESS",
    AFTER : "AFTER",
    ALL : [
        {value : "BEFORE", label : "Avant"},
        {value : "IN_PROGRESS", label : "Pendant"},
        {value : "AFTER", label : "Après"}
    ]
};
export const LEVELS =  {
    EASY : "EASY",
    MEDIUM : "MEDIUM",
    HARD : "HARD",
    ALL : [
        {value : "EASY", label : "Facile"},
        {value : "MEDIUM", label : "Moyen"},
        {value : "HARD", label : "Difficile"}
    ]
};

export const PRIORITIES =  {
    LOW : "LOW",
    MEDIUM : "MEDIUM",
    HIGH : "HIGH",
    ALL : [
        {value : "LOW", label : "Faible"},
        {value : "MEDIUM", label : "Moyenne"},
        {value : "HIGH", label : "Haute"}
    ]
};
export const STATUS =  {
    NEW : "NEW",
    STARTED : "STARTED",
    PENDING : "PENDING",
    FINISHED : "FINISHED",
    ALL : [
        {value : "NEW", label : "À faire"},
        {value : "STARTED", label : "En cours"},
        {value : "PENDING", label : "En attente"},
        {value : "FINISHED", label : "Terminée"},
    ]
};