(function () {
    const loader = document.querySelector('.dashboard-loader')
    const fadeIns = document.querySelectorAll('[data-fade]')
    const burger = document.querySelector('.dashboard-burger')
    const sidebar = document.querySelector('.dashboard-sidebar')

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (loader) loader.classList.add('_active')
            if (fadeIns) {
                const duration = 0.7;
                const translate = 60;

                animDefault()
                animFade()
                document.addEventListener('scroll', animFade);

                function animDefault() {
                    fadeIns.forEach(el => {
                        const fade = el.getAttribute('data-fade') || 'bottom|0'
                        const dir = fade.split('|')[0]

                        if (dir === 'left') {
                            stylize(el, {
                                opacity: '0',
                                transform: `translate(-${translate}px, 0px)`
                            })
                        } else if (dir === 'bottom') {
                            stylize(el, {
                                opacity: '0',
                                transform: `translate(0px, ${translate}px)`
                            })
                        } else if (dir === 'right') {
                            stylize(el, {
                                opacity: '0',
                                transform: `translate(${translate}px, 0px)`
                            })
                        }
                    })
                }

                function animFade() {
                    const action = document.body.clientHeight / 1.1

                    fadeIns.forEach(el => {
                        const top = el.getBoundingClientRect().top
                        const fade = el.getAttribute('data-fade') || 'bottom|0'
                        const delay = fade.split('|')[1]

                        if (top <= action) {
                            stylize(el, {
                                transition: `transform ${duration}s ease ${delay}s, opacity ${duration}s ease ${delay}s`,
                                opacity: '1',
                                transform: 'translate(0, 0)',
                            })
                        }

                        setTimeout(() => {
                            el.removeAttribute('style')
                            el.removeAttribute('data-fade')
                        }, (+duration + +delay) * 1000)
                    })
                }

                function stylize(elem, props) {
                    for (const prop in props) elem.style[prop] = props[prop]
                }
            }
        }, 300)
    })

    if (burger && sidebar) {
        burger.addEventListener('click', (e) => {
            document.body.classList.toggle('_lock')
            burger.classList.toggle('_active')
            sidebar.classList.toggle('_active')
        })

        sidebar.addEventListener('click', (e) => {
            if (sidebar.classList.contains('_active') && !e.target.closest('.dashboard-sidebar__inner')) {
                document.body.classList.remove('_lock')
                burger.classList.remove('_active')
                sidebar.classList.remove('_active')
            }
        })
    }
})()