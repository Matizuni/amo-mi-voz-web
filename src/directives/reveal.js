export default {

    mounted(el){

        const observer = new IntersectionObserver(

            entries=>{

                entries.forEach(entry=>{

                    if(entry.isIntersecting){

                        entry.target.classList.add('active')

                    }

                })

            },

            {

                threshold:.15

            }

        )

        observer.observe(el)

    }

}