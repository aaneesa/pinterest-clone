
        let page = 1;
        let fetching = false;
        const container = document.getElementById('container');
        const cols = Array.from(container.getElementsByClassName('col'));

        const fetchImageData = async () => {
            try {
                fetching = true;
                document.getElementById('loader').style.display = 'block';
                const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=50`);
                const data = await response.json();
                fetching = false;
                return data.map(img => `https://picsum.photos/${Math.floor(Math.random() * 200 + 200)}/${Math.floor(Math.random() * 200 + 200)}`);
            } catch (error) {
                console.error("Error fetching data:", error);
                fetching = false;
                throw error;
            }
        };

        const createCard = (image, col) => {
            const card = document.createElement('div');
            card.classList.add('card');
            const img = document.createElement('img');
            img.src = image;
            img.alt = "Random Image";
            img.style.width = "100%";
            img.onerror = function () {
                this.parentElement.style.display = "none";
            };
            img.onload = function () {
                document.getElementById('loader').style.display = 'none';
            };
            card.appendChild(img);
            col.appendChild(card);
        };

        const handleScroll = () => {
            if (fetching) return;

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const bodyHeight = document.documentElement.scrollHeight;

            if (bodyHeight - scrollTop - windowHeight < 800) {
                page++;
                fetchImageData().then((images) => {
                    if (images.length > 0) {
                        images.forEach((image, index) => {
                            createCard(image, cols[index % cols.length]);
                        });
                    }
                }).catch((error) => {
                    console.error("Error handling scroll:", error);
                });
            }
        };

        window.addEventListener('scroll', handleScroll);
        fetchImageData().then((images) => {
            if (images.length > 0) {
                images.forEach((image, index) => {
                    createCard(image, cols[index % cols.length]);
                });
            }
        }).catch((error) => {
            console.error("Error initial fetch:", error);
        });
