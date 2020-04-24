var currentBook = false;
var currentChapter = false;
const books = {
    gen: ['Genesis', 50, 'gen', 0, 'Gen'],
    exo: ['Exodus', 40, 'exo', 0, 'Exo'],
    lev: ['Leviticus', 27, 'lev', 0, 'Lev'],
    num: ['Numbers', 36, 'num', 0, 'Num'],
    deu: ['Deuteronomy', 34, 'deu', 0, 'Deu'],
    jos: ['Joshua', 24, 'jos', 0, 'Jos'],
    jud: ['Judges', 21, 'jud', 0, 'Jud'],
    rut: ['Ruth', 4, 'rut', 0, 'Ruth'],
    sa1: ['1 Samuel', 31, 'sa1', 0, '1 Sa'],
    sa2: ['2 Samuel', 24, 'sa2', 0, '2 Sa'],
    ki1: ['1 Kings', 22, 'ki1', 0, '1 Ki'],
    ki2: ['2 Kings', 25, 'ki2', 0, '2 Ki'],
    ch1: ['1 Chronicles', 29, 'ch1', 0, '1 Ch'],
    ch2: ['2 Chronicles', 36, 'ch2', 0, '2 Ch'],
    ezr: ['Ezra', 10, 'ezr', 0, 'Ezra'],
    neh: ['Nehemiah', 13, 'neh', 0, 'Neh'],
    est: ['Esther', 10, 'est', 0, 'Est'],
    job: ['Job', 42, 'job', 0, 'Job'],
    psa: ['Psalms', 150, 'psa', 0, 'Psa'],
    pro: ['Proverbs', 31, 'pro', 0,'Pro'],
    ecc: ['Ecclesiastes', 12, 'ecc', 0, 'Ecc'],
    son: ['Song of Solomon', 8, 'son', 0, 'Son'],
    isa: ['Isaiah', 66, 'isa', 0, 'Isa'],
    jer: ['Jeremiah', 52, 'jer', 0, 'Jer'],
    lam: ['Lamentations', 5, 'lam', 0, 'Lam'],
    eze: ['Ezekiel', 48, 'eze', 0, 'Eze'],
    dan: ['Daniel', 12, 'dan', 0, 'Dan'],
    hos: ['Hosea', 14, 'hos', 0, 'Hos'],
    joe: ['Joel', 3, 'joe', 0, 'Joel'],
    amo: ['Amos', 9, 'amo', 0, 'Amos'],
    oba: ['Obadiah', 1, 'oba', 0, 'Oba'],
    jon: ['Jonah', 4, 'jon', 0, 'Jon'],
    mic: ['Micah', 7, 'mic', 0, 'Mic'],
    nah: ['Nahum', 3, 'nah', 0, 'Nah'],
    hab: ['Habakkuk', 3, 'hab', 0, 'Hab'],
    zep: ['Zephaniah', 3, 'zep', 0, 'Zep'],
    hag: ['Haggai', 2, 'hag', 0, 'Hag'],
    zec: ['Zechariah', 14, 'zec', 0, 'Zec'],
    mal: ['Malachi', 4, 'mal', 0, 'Mal'],
    mat: ['Matthew', 28, 'mat', 1, 'Mat'],
    mar: ['Mark', 16, 'mar', 1, 'Mark'],
    luk: ['Luke', 24, 'luk', 1, 'Luke'],
    joh: ['John', 21, 'joh', 1, 'John'],
    act: ['Acts', 28, 'act', 1, 'Acts'],
    rom: ['Romans', 16, 'rom', 1, 'Rom'],
    co1: ['1 Corinthians', 16, 'co1', 1, '1 Co'],
    co2: ['2 Corinthians', 13, 'co2', 1, '2 Co'],
    gal: ['Galatians', 6, 'gal', 1, 'Gal'],
    eph: ['Ephesians', 6, 'eph', 1, 'Eph'],
    phi: ['Philippians', 4, 'phi', 1, 'Php'],
    col: ['Colossians', 4, 'col', 1, 'Col'],
    th1: ['1 Thessalonians', 5, 'th1', 1, '1 Th'],
    th2: ['2 Thessalonians', 3, 'th2', 1, '2 Th'],
    ti1: ['1 Timothy', 6, 'ti1', 1, '1 Ti'],
    ti2: ['2 Timothy', 4, 'ti2', 1, '2 Ti'],
    titus: ['Titus', 3, 'titus', 1, 'Titus'],
    phile: ['Philemon', 1, 'phile', 1, 'Phm'],
    heb: ['Hebrews', 13, 'heb', 1, 'Heb'],
    jam: ['James', 5, 'jam', 1, 'Jam'],
    pe1: ['1 Peter', 5, 'pe1', 1, '1 Pe'],
    pe2: ['2 Peter', 3, 'pe2', 1, '2 Pe'],
    jo1: ['1 John', 5, 'jo1', 1, '1 Jo'],
    jo2: ['2 John', 1, 'jo2', 1, '2 Jo'],
    jo3: ['3 John', 1, 'jo3', 1, '3 Jo'],
    jude: ['Jude', 1, 'jude', 1, 'Jude'],
    rev: ['Revelation', 22, 'rev', 1, 'Rev']
};


$('document').ready(function() {
    // watch for location changes
    window.addEventListener('locationchange', function(){
        let urlParams = new URLSearchParams(window.location.search);
        let book = urlParams.get('book') ? urlParams.get('book') : '';
        let chapter = urlParams.get('chapter') ? urlParams.get('chapter') : '';
        if (book && chapter) {
            updateChapter(book, chapter);
        } else {
            updateChapter(localStorage.book, localStorage.chapter);
        }
    });
    history.pushState = ( f => function pushState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.pushState);
    history.replaceState = ( f => function replaceState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.replaceState);
    window.addEventListener('popstate',()=>{
        window.dispatchEvent(new Event('locationchange'))
    });

    let request = window.indexedDB.open("BibleDatabase", 1), db, tx, store;
    request.onupgradeneeded = function(e) {
        // specify keyPath: add {keyPath: "bible"} to store = db.createObjectStore
        let db = request.result, store = db.createObjectStore("BibleStore", {keyPath: "bible"})
    };
    request.onerror = function(e) {
        console.log('IDB error:', e.target.errorCode);
    };
    request.onsuccess = function(e) {
        db = request.result;
        tx = db.transaction("BibleStore", "readwrite");
        store = tx.objectStore("BibleStore");

        db.onerror = function(e) {
            console.log('db error:', e.target.errorCode);
        };

        let gottenFromDb = store.get("plainHtml");
        gottenFromDb.onsuccess = function() {
            // console.log('looking for Bible. Result:', gottenFromDb.result);
            if (!gottenFromDb.result) {
                // there's no Bible in IDB. Pop up the download modal
                $('#modalDownload').addClass('active');
                setTimeout(function() { $('#passkeyField').focus(); }, 310);
            }
        };

        tx.oncomplete = function() {
            db.close;
        }
    };
    if (!sessionStorage.history) {
        let sessionHistory = {history: []}
        sessionStorage.setItem('history', JSON.stringify(sessionHistory));
    }
    if (localStorage.book && localStorage.chapter) {
        replaceParams(localStorage.book, localStorage.chapter);
        // push current chapter into sesh storage
    } else {
        updateChapter('gen', 0);
    }

    $('#ntTab').on('click', function() {
        ntTab();
    });

    $('#otTab').on('click', function() {
        otTab();
    });

    $('.browseLink').on('click', function() {
        var browseLinkBox = $('.browseLinkBox');

        if (!browseLinkBox.hasClass('active')) {
            browseLinkBox.addClass('active');
            $('.chapPicker').addClass('active');
        }
        else {
            browseLinkBox.removeClass('active');
            $('.chapPicker').removeClass('active');
        }
    });

    $('.bookLink').on('click', function() {
        var id = this.id;
        console.log('bookLink clicked. Id:', id);

        // update chapters links
        $('#chapLinkHeader').text(books[id][0]);
        var outputString = '';
        for (let i=0; i<books[id][1]; i++) {
            outputString += '<div class="chapLink chapterLink" id="' + books[id][2] + '_' + (i + 1) + '"><p class="chapLinkText"">' + (i + 1) + '</p></div>';
        }

        $('.chapLinkWrapper').empty().append(outputString);

        $('.chapterLink').on('click', function() {
            console.log('chapter link click!');
            var chapterId = this.id;
            chapterId = chapterId.split("_");
            console.log('chapter id after split:', chapterId);
            updateParams(chapterId[0], parseInt(chapterId[1]) - 1);
        });

        // move stuff around
        $('#otLinks, #ntLinks').addClass('up');
        $('#chapterLinks').removeClass('down');

    });

    $('#nextLink').on('click', function() {
        nextChapter();
    });

    $('#prevLink').on('click', function() {
        prevChapter();
    });

    $('#historyLink').on('click', function() {
        if ($('.history').hasClass('active')) {
            $('.history').removeClass('active');
            $('#historyLink').removeClass('active');
            $('.historyEntry').off('click');
        } else {
            $('.history').addClass('active');
            $('#historyLink').addClass('active');
            doHistory();
        }
    });

    $('#menuLink').on('click', function() {
        $('#kabobIcon').toggleClass('rotated');
        $('#footerExt').toggleClass('active');
    });

    $('#selectIcon').on('click', function() {
        $('#selectIcon').toggleClass('active');
        $('.text').toggleClass('selectable');
    });

    $('#gatewayIcon').on('click', function() {
        window.open('https://www.biblegateway.com/passage/?search=' + localStorage.book + '+' + (parseInt(localStorage.chapter) + 1) + '&version=ESV', '_blank');
    });

    $('#gateSelfIcon').on('click', function() {
        window.open('https://www.biblegateway.com/passage/?search=' + localStorage.book + '+' + (parseInt(localStorage.chapter) + 1) + '&version=ESV', '_self');
    });

    $('#downloadForm').submit(function() {
        getBible($('#passkeyField').val());
        return false;
    });

    /* -----------------------------------------------------
    Material Design Buttons
    https://codepen.io/rkchauhan/pen/NNKgJY
    By: Ravikumar Chauhan
    Find me on -
    Twitter: https://twitter.com/rkchauhan01
    Facebook: https://www.facebook.com/ravi032chauhan
    GitHub: https://github.com/rkchauhan
    CodePen: https://codepen.io/rkchauhan
    -------------------------------------------------------- */
    (function($) {
        $.fn.rkmd_rippleEffect = function() {
            var btn, self, ripple, size, rippleX, rippleY, eWidth, eHeight;

            btn = $(this).not('[disabled], .disabled');

            btn.on('mousedown', function(e) {
                self = $(this);

                // Disable right click
                if(e.button === 2) {
                    return false;
                }

                if(self.find('.ripple').length === 0) {
                    self.prepend('<span class="ripple"></span>');
                }
                ripple = self.find('.ripple');
                ripple.removeClass('animated');

                eWidth = self.outerWidth();
                eHeight = self.outerHeight();
                size = Math.max(eWidth, eHeight);
                ripple.css({'width': size, 'height': size});

                rippleX = parseInt(e.pageX - self.offset().left) - (size / 2);
                rippleY = parseInt(e.pageY - self.offset().top) - (size / 2);

                ripple.css({ 'top': rippleY +'px', 'left': rippleX +'px' }).addClass('animated');

                setTimeout(function() {
                    ripple.remove();
                }, 800);

            });
        };
    }(jQuery));
    $('.ripple-effect').rkmd_rippleEffect();
}); // end doc ready

function getBible(key) {
    var settings = {
        "url": "php-bible/get-bible.php",
        "method": "POST",
        "timeout": 0,
        "data": {
            key: key
        },
    };
    $.ajax(settings).done(function (response) {
        console.log('received Bible. Gonna put it in indexedDB.');
        let request = window.indexedDB.open("BibleDatabase", 1), db, tx, store;
        request.onupgradeneeded = function(e) {
            // specify keyPath: add {keyPath: "bible"} to store = db.createObjectStore
            let db = request.result, store = db.createObjectStore("BibleStore", {keyPath: "bible"})
        };
        request.onerror = function(e) {
            console.log('IDB error:', e.target.errorCode);
        };
        request.onsuccess = function(e) {
            db = request.result;
            tx = db.transaction("BibleStore", "readwrite");
            store = tx.objectStore("BibleStore");

            db.onerror = function(e) {
                console.log('db error:', e.target.errorCode);
            };

            store.put({bible: 'plainHtml', text: JSON.parse(response)});
            $('#modalDownload').removeClass('active');
            //
            // let gottenFromDb = store.get("bible");
            // gottenFromDb.onsuccess = function() {
            //     console.log('got eem! Result:', gottenFromDb.result);
            // };
            //
            // tx.oncomplete = function() {
            //     db.close;
            // }
        };
    });
}

function ntTab() {
    $('#ntTab').addClass('active');
    $('#otTab').removeClass('active');

    $('#otLinks').addClass('left').removeClass('up');
    $('#ntLinks').removeClass('right up');
    $('#chapterLinks').addClass('down');

    $('.chapPickerLinksWrapper').css('height', '240px');
}
function otTab() {
    $('#ntTab').removeClass('active');
    $('#otTab').addClass('active');

    $('#otLinks').removeClass('left up');
    $('#ntLinks').addClass('right').removeClass('up');
    $('#chapterLinks').addClass('down');

    $('.chapPickerLinksWrapper').css('height', '336px');
}

function updateChapter(book, chapter) {
    chapter = parseInt(chapter);
    // close chapPicker
    $('.browseLinkBox').removeClass('active');
    $('.chapPicker').removeClass('active');

    console.log('updateChapter function. Book:', book, ' chapter:', chapter);
    let request = window.indexedDB.open("BibleDatabase", 1), db, tx, store;
    request.onsuccess = function(e) {
        db = request.result;
        tx = db.transaction("BibleStore", "readwrite");
        store = tx.objectStore("BibleStore");

        let gottenFromDb = store.get("plainHtml");
        gottenFromDb.onsuccess = function() {
            currentBook = book;
            currentChapter = chapter;
            $('#textTitle').text(books[book][0] + ' ' + (chapter + 1));
            $('.esv-text').html(gottenFromDb.result.text[book][chapter]);
            $('.browseLinkBoxTitle').text(books[book][0] + ' ' + (chapter + 1));
            $('.chapLink').removeClass('active');
            $('#' + book).addClass('active');
            $('#' + book + chapter).addClass('active');
            // set tab to the tab of the current book
            if (books[book][3] === 0) {
                otTab();
            } else {
                ntTab();
            }
            $('html, body').scrollTop(0);

            localStorage.setItem('book', book);
            localStorage.setItem('chapter', chapter);

            let currentHistory = JSON.parse(sessionStorage.history);
            currentHistory.history.push({book: book, chapter: chapter});
            sessionStorage.setItem('history', JSON.stringify(currentHistory));
        };
        //
        // tx.oncomplete = function() {
        //     db.close;
        // }
    };
}

function nextChapter() {
    // look at current chapter and compare to number of chapters in book
    // if book has more chapters, go to next chapter
    let currentChapter = localStorage.chapter;
    let currentBook = localStorage.book;
    console.log('nextChapter function! current book:', currentBook, 'current chapter', currentChapter);
    if (parseInt(currentChapter) < (books[localStorage.book][1] - 1)) {
        console.log('there is another chapter');
        localStorage.setItem('chapter', (parseInt(currentChapter) + 1 + ''));
        updateParams(localStorage.book, localStorage.chapter);
    } else {
        console.log('there is NOT ANOTHER CHAPTER');
        let foundItem = false
        for (let key in books) {
            if (books.hasOwnProperty(key)) {
                if (foundItem) {
                    localStorage.setItem('chapter', '0');
                    localStorage.setItem('book', key);
                    updateParams(localStorage.book, localStorage.chapter);
                    break;
                }
                if (key === currentBook) {
                    console.log('found item!');
                    foundItem = true;
                }
            }
        }
    }
    // and do something for gen and rev
}

function prevChapter() {
    // look at current chapter and compare to number of chapters in book
    // if book has more chapters, go to next chapter
    let currentChapter = localStorage.chapter;
    let currentBook = localStorage.book;
    console.log('prevChapter function! current book:', currentBook, 'current chapter', currentChapter);
    if (parseInt(currentChapter) !== 0) {
        console.log('there is another previous chapter');
        localStorage.setItem('chapter', (parseInt(currentChapter) - 1 + ''));
        updateParams(localStorage.book, localStorage.chapter);
    } else {
        console.log('there is NOT another prev chapter');
        let foundItem = false;
        let prevItem = '';
        for (let key in books) {
            if (books.hasOwnProperty(key)) {
                if (foundItem) {
                    console.log('doing foundItem stuff. prevItem:', prevItem);
                    localStorage.setItem('chapter', (books[prevItem][1] - 1 + ''));
                    localStorage.setItem('book', prevItem);
                    updateParams(localStorage.book, localStorage.chapter);
                    break;
                }
                if (key === currentBook) {
                    console.log('found item!');
                    foundItem = true;
                } else {
                    prevItem = key;
                }
            }
        }
    }
    // and do something for gen and rev
}

function doHistory() {
    $('.historyEntryWrapper').empty();
    let userHistory = JSON.parse(sessionStorage.history).history;
    let prevElem = '';
    for (let i=0; i<userHistory.length; i++) {
        if (prevElem !== (userHistory[i].book + userHistory[i].chapter)) {
            $('.historyEntryWrapper').prepend('<p class="historyEntry" id="' + userHistory[i].book + '_' + userHistory[i].chapter + '">' + books[userHistory[i].book][0] + ' ' + (parseInt(userHistory[i].chapter) + 1) + '</p>');
        }
        prevElem = userHistory[i].book + userHistory[i].chapter;
    }
    $('.historyEntry').on('click', function() {
        $('.history').removeClass('active');
        $('#historyLink').removeClass('active');
        $('.historyEntry').off('click');

        let id = this.id.split('_');
        updateChapter(id[0], id[1]);
    });
}

function updateParams(book, chapter) {
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?book=' + book + '&chapter=' + chapter;
    window.history.pushState({ path: newurl }, '', newurl);
}
function replaceParams(book, chapter) {
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?book=' + book + '&chapter=' + chapter;
    window.history.replaceState({ path: newurl }, '', newurl);
}
