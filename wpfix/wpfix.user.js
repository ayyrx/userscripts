// ==UserScript==
// @name         wpfix
// @namespace    https://github.com/r1vn/userscripts/wpfix
// @version      2020-09-08 02.45
// @description  random wikipedia tweaks
// @author       r1vn
// @match        *://*.wikipedia.org/*
// @grant        none
// ==/UserScript==

(function ()
{
    ///////////////////////////////////////
    // config
    // this is the only part of the script you need to modify
    ///////////////////////////////////////
    const enableLanguageSidebarFix = true
    const enableLanguageSidebarAltView = true
    const enableMobileRedirect = true
    const enableImageCropFix = true
    ///////////////////////////////////////

    let style = ``
    const fns = []

    // enableMobileRedirect

    if (enableMobileRedirect)
    {
        if (window.location.href.indexOf('.m.wikipedia.org') !== -1)
        {
            window.location.href = window.location.href.replace('.m.', '.')
            console.log(`wpfix: redirected to desktop view`)
        }
    }

    // enableLanguageSidebarFix

    if (enableLanguageSidebarFix)
    {
        style += `
        .mw-interlanguage-selector {
            display: none !important;
        }
        
        .interlanguage-link {
            display: list-item !important;
        }`
    }

    // enableLanguageSidebarAltView

    if (enableLanguageSidebarAltView)
    {
        style += `       
        .wpfix-altspan2 {
            color: #aaa;
            font-size: 1em !important;
            line-height: 1em !important;
        }
        
        .wpfix-altspan3 {
            /*color: #000;*/
            font-size: 1.2em !important;
            line-height: 1.2em !important;
        }
        
        .interlanguage-link {
            padding: 0.25em 0 !important;
        }
               
        .interlanguage-link-target:hover {
            text-decoration: none !important;
            font-weight: bold;
        }
        
        `

        fns.push(() =>
        {
            let lis = document.querySelectorAll(`.interlanguage-link`)

            for (const li of lis)
            {
                const a = li.querySelector('.interlanguage-link-target')

                // ugly temporary hack until further investigation
                let [title, langnameTrans] = a.title.split(' – ')
                if (!title || !langnameTrans) [title, langnameTrans] = a.title.split(' — ')
                // questionable
                if (langnameTrans.indexOf('(') !== -1) langnameTrans = langnameTrans.slice(0, langnameTrans.indexOf('('))
                //const langnameNative = link.innerText

                a.wpfix_langnameTrans = langnameTrans

                a.innerHTML =
                `<span class="wpfix-altspan2">${ langnameTrans }</span><br>` +
                `<span class="wpfix-altspan3">${ title }</span>`
            }

            lis = Array.from(lis)
            lis.sort((a, b) =>
            {
                const a_a = a.querySelector('.interlanguage-link-target')
                const b_a = b.querySelector('.interlanguage-link-target')
                return a_a.wpfix_langnameTrans > b_a.wpfix_langnameTrans
            })

            const ul = lis[0].parentNode
            ul.innerHTML = ''
            lis.forEach(li => ul.appendChild(li))
        })
    }

    // enableImageCropFix

    if (enableImageCropFix)
    {
        style += `
        .mw-mmv-image-wrapper {
            bottom: 0 !important;
        }
        
        .mw-mmv-image > img {
            max-height: 100vh !important;
        }`
    }

    //

    window.addEventListener('load', () =>
    {
        document.querySelector(`body`).innerHTML += `<style id="wpfix_style">${ style }</style>`
        fns.forEach(fn => fn())
    })
})()
