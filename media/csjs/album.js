;(function() {
    class Album {
        constructor() {
            var album = document.querySelector('.page-album');
            var photos = album.querySelectorAll('.photo');

            this._container = album;
            this._photoNode = Array.from(photos);
            this._indicator = album.querySelector('.indicator');
            this._enabled = false;
            this._imageLoadHanlder = this._imageLoadHanlder.bind(this);
            this._transitionEndHanlder = this._transitionEndHanlder.bind(this);
            this._clickIndicatorHandler =
                this._clickIndicatorHandler.bind(this);
            this._currentIndex = -1;
        }

        enable() {
            this._container.classList.add('full');
            this._container.classList.remove('flow');
            this._photoNode.forEach((p, index) => {
                var id = 'photo-' + index;
                var imageNode = p.querySelector('.pic img');

                p.id = id;
                p.style.opacity = '0';
                p.style.zIndex = '0';
                p.addEventListener('transitionend', this._transitionEndHanlder);

                if (p.dataset.ready == '1') {
                    this._decideStyle(p);
                } else {
                    var image = new Image();

                    image.dataset.id = id;
                    image.addEventListener('load', this._imageLoadHanlder);
                    image.src = imageNode.src;
                }
                imageNode.style.display = 'none';
                p.querySelector('.pic').style.backgroundImage = 'url(' +
                    imageNode.src + ')'

                this._indicator.addEventListener('click',
                    this._clickIndicatorHandler);
                this._createIndicator();
            });
            this._decideReady();
        }

        disable() {
            this._container.classList.add('flow');
            this._container.classList.remove('full');
            this._photoNode.forEach((p, index) => {
                p.style.opacity = '1';
                p.classList.remove('view-landscape');
                p.classList.remove('view-portrait');
                p.removeEventListener('transitionend',
                    this._transitionEndHanlder);
                p.querySelector('.pic img').style.display = '';
                p.querySelector('.pic').style.backgroundImage = '';
            });
            this._indicator.style.disable = 'none';
            this._indicator.removeEventListener('click',
                this._clickIndicatorHandler);
        }

        show(index) {
            if (index < 0 || index > this._photoNode.length - 1) {
                throw 'over index';
            }
            if (this._currentIndex > -1) {
                this._photoNode[this._currentIndex].style.opacity = '0';
            }

            this._photoNode[index].style.opacity = '1';
            this._currentIndex = index;
            this._updateIndicator();
        }

        _decideStyle(photoNode) {
            var {width, height} = photoNode.dataset;
            var ratio = width / height;
            var className = ratio >= 1 ? 'view-landscape' : 'view-portrait'

            photoNode.classList.add(className);
        }

        _decideReady() {
            var ready = this._photoNode.every((p) => p.dataset.ready == '1');

            if (ready) {
                this.show(0);
                this._container.querySelector('.loading').style.display =
                    'none';
            }
        }

        _imageLoadHanlder(event) {
            var target = event.target;
            var {width, height} = target;
            var id = target.dataset.id;
            var photoNode = document.getElementById(id);

            photoNode.dataset.width = width;
            photoNode.dataset.height = height;
            photoNode.dataset.ready = '1';
            this._decideStyle(photoNode);
            this._decideReady();
        }

        _transitionEndHanlder(event) {
            var target = event.target;

            if (target.style.opacity == '0') {
                target.style.zIndex = '0';
            } else {
                target.style.zIndex = '1';
            }
        }

        _createIndicator() {
            var htmlStr = '';

            for (let i = 0; i < this._photoNode.length; i++) {
                htmlStr += `<b data-index="${i}"></b>`;
            }
            this._indicator.innerHTML = htmlStr;
            this._indicator.style.disable = '';
        }

        _updateIndicator() {
            Array.from(this._indicator.querySelectorAll('b')).forEach((b, i) => {
                if (b.dataset.index == this._currentIndex) {
                    b.classList.add('on');
                } else {
                    b.classList.remove('on');
                }
            });
        }

        _clickIndicatorHandler(event) {
            var target = event.target;
            var index = target.dataset.index;

            if (index) {
                this.show(index);
            }
        }
    }

    self.Album = Album
})();
