const isValidSelector = (selector) => {
    try {
        let el = document.querySelector(selector);
        if (!el) {
            return false;
        }
   } catch (e) {
        return false;
   }
   return true;
}

const removeActiveElement = () => {
    let iter = document.querySelectorAll('.ozx-active, .ozx-active-flakes').entries()
    while(true) {
        let result = iter.next();
        if (result.done) break;
        if (result.value) {
            result.value[1].classList.remove(['ozx-active'],['ozx-active-flakes'])
            result.value[1].style.backgroundImage = ''
        }
      }
}

const createName = (element) => {
    let skippedTags = ['BODY', 'HTML']
    let name = '';
    if (element.id) {
        name = element.tagName+'#'+element.id
    }
    else {
        if (element.parentElement && element.parentElement.parentElement) {
            name += element.parentElement.parentElement.tagName
            if (skippedTags.indexOf(element.parentElement.parentElement.tagName) < 0) {

                if (element.parentElement.parentElement.id) {
                    name += '#'+element.parentElement.parentElement.id+' ';
                }
                else if (element.parentElement.parentElement.className) {
                    name += '.'+element.parentElement.parentElement.className.replaceAll(' ', '.')+' ';
                }

            }
        }

        if (element.parentElement) {
            name += ' '+element.parentElement.tagName
            if (skippedTags.indexOf(element.parentElement.tagName) < 0) {
                if (element.parentElement.id) {
                    name += '#'+element.parentElement.id+' ';
                }
                else if (element.parentElement.className) {
                    name += '.'+element.parentElement.className.replaceAll(' ', '.')+' ';
                }
            }
        }

        name += name !== '' ? ' '+element.tagName : element.tagName 
        ['ozx-active-flakes', 'ozx-active','ozx_focus'].map(val => {
            name = name.replace(val, '')
        })

        if (element.className && skippedTags.indexOf(element.tagName) < 0) {
            let n = element.className;
            ['ozx-active-flakes', 'ozx-active','ozx_focus'].map(val => {
                n = n.replace(val, '')
            })
            if (n && n.trim().replaceAll(' ', '.'))
            name += '.'+n.trim().replaceAll(' ', '.')
        }
    }

    return name;
}

export {isValidSelector, removeActiveElement, createName};