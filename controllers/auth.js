exports.signup=async (req,res)=>{
try {
    res.send('i am working');
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
}
}