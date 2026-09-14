const getCancellationIntent = ({
    customerMessage
}) => {

    if (
        !customerMessage ||
        typeof customerMessage !== "string"
    ) {
        return {
            wantsCancellation: false
        };
    }


    const normalizedMessage =
        customerMessage
            .trim()
            .toLowerCase()
            .replace(/[’‘]/g, "'")
            .replace(/\s+/g, " ");


    const cancellationPatterns = [

        /\bcancel\b/,
        /\bcancellation\b/,
        /\bcall off\b/,
        /\bcall it off\b/

    ];


    const wantsCancellation =
        cancellationPatterns.some(
            pattern =>
                pattern.test(
                    normalizedMessage
                )
        );


    return {
        wantsCancellation
    };
};


module.exports = {
    getCancellationIntent
};