
//Generating the short url

const ItemCtrl = (function () {
    const Item = function (id, url, shorturl) {
        this.id = id;
        this.url = url;
        this.shorturl = shorturl;
    };

    //to store the data
    const data = {
        //array of the items containing the id, url, shorturl
        items: [],
        currentItem: null
    };

    // to retrieve through public methods 
    return {
        logData: function () {
            return data;
        },

        addLink: function (link) {
            let ID;

            //create id 
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            let shortLink;
            shortLink = ItemCtrl.generateLink();
            //create a new item 
            const newItem = new Item(ID, link, shortLink);

            data.items.push(newItem);

            return newItem;
        },

        //generate a short link
        generateLink: function () {
            const c1 = ItemCtrl.generateCharacter();
            const c2 = ItemCtrl.generateCharacter();
            const c3 = ItemCtrl.generateCharacter();
            const c4 = ItemCtrl.generateCharacter();

            return 'http://shortn.me/' + c1 + c2 + c3 + c4;
        },

        generateCharacter: function () {
            const arr = 'abcdefghijklmnopqrstuvwxyz0987654321?/()&%'

            return arr[Math.floor(Math.random() * arr.length)];
        },

        //get the item's id

        getItemById: function (ID) {
            let found = null;

            data.items.forEach(function (item) {
                if (item.ID === ID) {
                    found = item;
                }
            })

            return found;
        },

        //set current link
        setCurrentLink: function (link) {
            data.currentItem = link;
            return data.currentItem.shorturl;
        }
    }

})();

const UICtrl = (function () {

    //dom selectors
    const UISelectors = {
        linkInput: '#shortener',
        shortItBtn: '#submit_btn',
        linksContainer: '.links_container',
        errorMsg: '.error_msg',
        copyLink: '.copy_btn'
    }

    //public methods
    return {
        getSelectors: function () {
            return UISelectors;
        },
        getLinkInput: function () {
            return {
                longLink: document.querySelector(UISelectors.linkInput).value
            }
        },

        //check for valid url
        errorLink: function () {
            const errorMsg = document.querySelector(UISelectors.errorMsg);
            errorMsg.id = 'error_msg show';

            //after 3 seconds of the error the message will disappear
            setTimeout(function () {
                errorMsg.id = 'error_msg'
            }, 3000);

            UICtrl.clearInput();
        },

        clearInput: function () {
            document.querySelector(UISelectors.linkInput).value = '';
        },

        addListLink: function (item) {
            const div = document.createElement('div');
            div.className = 'link';
            div.id = `link-${item.id}`;

            div.innerHTML = `
            <span class="long_link">${item.url}</span>
            <span class="short_link"><a href="${item.url}" target="blank">${item.shorturl}</a></span>
            <button class ="copy_btn">Copy</button>`;

            document.querySelector(UISelectors.linksContainer).insertAdjacentElement('beforeend', div);
        },

        copyShortLink: function (link) {
            const textarea = document.createElement('textarea');
            const copiedLink = link;

            textarea.value = copiedLink;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
        },

        changeButton: function (btn) {
            btn.style.backgroundColor = '#21243d';
            btn.style.color = 'white';
            btn.innerHTML = 'Copied!';
        }
    }
})();

//load the previous methods

const App = (function (ItemCtrl, UICtrl) {
    //event listeners

    const loadEvents = function () {
        const UISelectors = UICtrl.getSelectors();

        document.querySelector(UISelectors.shortItBtn).addEventListener('click', addLink);

        document.querySelector(UISelectors.linksContainer).addEventListener('click', copyLink);
    }

    //add new link
    const addLink = function (e) {
        // get the link input
        const input = UICtrl.getLinkInput();

        if (input.longLink !== '') {
            const re = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www.\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

            if (re.test(input.longLink) == false) {
                UICtrl.errorLink();
            } else if (re.test(input.longLink) == true) {
                //add new link

                const newLink = ItemCtrl.addLink(input.longLink);
                //add item to list
                UICtrl.addListLink(newLink);

                UICtrl.clearInput();
            }
        }
        e.preventDefault();
    };

    //copy link

    const copyLink = function(e){
        if(e.target.classList.contains('copy_btn')){
            //get item id
            const linkID = e.target.parentNode.id;
            const linkArr = linkID.split('-');
            //get the actual id
            const id = parseInt(linkArr[1]);

            const linkToCopy = ItemCtrl.getItemById(id);
            if(linkToCopy){
                const currentLink = ItemCtrl.setCurrentLink(linkToCopy);
            UICtrl.copyShortLink(currentLink);
            UICtrl.changeButton(e.target);
            }
        }
    }

    //init function
    return {
        init: function(){
            loadEvents();
        }
    }

})(ItemCtrl, UICtrl);

App.init();