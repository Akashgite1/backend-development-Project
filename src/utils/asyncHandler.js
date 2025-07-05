// const asyncHandler = () => {}
//! Wrapper function to handle async errors in Express.js 


// const asyncHandler = (fn) => {}
// const asyncHandler = (fn) => () => {}
// const asyncHandler = (fn) => async () =>{}
    // async function help us to perform asynchronous operations 
    // those task that depend on other task before they can be executed 
    // for example, sychronus code will execute one line after another 
// but asynchronous code will execute only after certain task is completed 


const asyncHandler = (fn) => async (req, res, next) => {

    try {
        await fn(req, res, next);
        // If the function executes successfully, it will call the next middleware
        // or send a response, so no need to do anything here.  

    } catch (error) {
        // If an error occurs, pass it to the next middleware
        res.status(error.code || 500).json({
            success: false,
            message: error.message || 'Internal Server Error',
            error: error
        });
    }

}

//! another way of writing it 
//  const asyncHandler = (fn) => {
//     return (req, res, next) => {
//         Promise.resolve(fn(req, res, next)).catch((error) => next(error));   
//     }
// }

export { asyncHandler }