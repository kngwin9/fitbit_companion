import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

export default () => {
    const styles = {
        paper: {position: 'relative', height: '100%', width: '100%'},
        h1: {'fontSize': '2em', 'textAlign': 'center'},
        h3: {color: '#9CCC65', 'textAlign': 'center'},
        p: {textAlign: 'center', width: '75%', margin: '0 auto'},
        button: { zIndex: 0, width: '75%', position: 'relative', left: '10%', bottom: '5%', margin: '7% 0 0 0'}
    };
    return (
        <Paper style={styles.paper} zDepth={3}>
            <div style={{padding: '10%'}}>
                <h1 style={styles.h1}>Hey there!</h1>
                <h3 style={styles.h3}>You've successfully connected to Fitbit!</h3>
                <p style={styles.p}> Based on your activity level from yesterday and your interests we've found events you may like. Come back tomorrow to see new ones!</p>
                <RaisedButton style={styles.button} label="Take Me to These Events!" primary={true} />
            </div>
        </Paper>
    )
}