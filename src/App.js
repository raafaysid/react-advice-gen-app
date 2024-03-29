import React from 'react';
import axios from 'axios';
import './App.css';

class App extends React.Component {
    state = {
        advice: '',
        favorites: []
    };

    componentDidMount() {
        this.fetchAdvice();
        const savedFavorites = JSON.parse(localStorage.getItem('favorites'));
        if (savedFavorites) {
            this.setState({ favorites: savedFavorites });
        }
    }

    fetchAdvice = () => {
        axios.get('https://api.adviceslip.com/advice')
            .then((response) => {
                const { advice } = response.data.slip;
                this.setState({ advice });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    saveToFavorites = () => {
        this.setState(prevState => {
            const updatedFavorites = [...prevState.favorites, prevState.advice];
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            return { favorites: updatedFavorites };
        });
    };

    removeFromFavorites = (adviceToRemove) => {
        this.setState(prevState => {
            const updatedFavorites = prevState.favorites.filter(advice => advice !== adviceToRemove);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            return { favorites: updatedFavorites };
        });
    };

    copyToClipboard = () => {
        const { advice } = this.state;
        navigator.clipboard.writeText(advice).then(() => {
            alert("Advice copied to clipboard!");
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    render() {
        const { advice, favorites } = this.state;
        return (
            <div className="app">
                <div className='card'>
                    <h1 className='heading'>{advice}</h1>
                    <button className='button' onClick={this.fetchAdvice}>
                        <span>GIVE ME ADVICE!</span>
                    </button>
                    <button className='button' onClick={this.saveToFavorites}>
                        <span>SAVE TO FAVORITES</span>
                    </button>
                    <button className='button' onClick={this.copyToClipboard}>
                        <span>COPY TO CLIPBOARD</span>
                    </button>
                </div>
                {favorites.length > 0 && (
                    <div className='favorites-card'>
                        <h2 className='favorites-title'>Your Saved Advice</h2>
                        <ul className='favorites-list'>
                            {favorites.map((fav, index) => (
                                <li key={index}>
                                    {fav}
                                    <button className="remove-fav-btn" onClick={() => this.removeFromFavorites(fav)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }
}

export default App;
