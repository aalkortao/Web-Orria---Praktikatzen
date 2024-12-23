// Ihardunaldi batean apuntatu
app.post('/register/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    Event.findById(id, (err, event) => {
        if (err) return res.send('Errorea ihardunaldiak lortzean');
        if (event.attendees.length < event.capacity) {
            event.attendees.push(name);
            event.save((err) => {
                if (err) return res.send('Errorea apuntatzean');
                res.redirect('/');
            });
        } else {
            res.send('Ihardunaldia beteta dago');
        }
    });
});
