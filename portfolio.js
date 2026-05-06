
/* team.js
   Team grid + modal logic. Clicking member with id === 3 navigates to Kirby.html
*/

const teamMembers = [
    {
        id: 1,
        name: "Justin Curtis P. Baysa",
        role: "Lead Developer / Founder",
        image: "assets/images/justin.jpg",
        shortDesc: "Visionary creator of NanoNexus, specializing in robust web architecture.",
        longDesc: "As the Lead Developer and Founder, Justin spearheads the technical direction of NanoNexus. With a passion for seamless user experiences and cutting-edge web technologies, he ensures that the platform is not just functional, but exceptional. When he's not coding, he's exploring the latest gaming gear.",
        skills: [
            { name: "Frontend Development", level: 95 },
            { name: "UI/UX Design", level: 85 },
            { name: "Project Management", level: 90 }
        ],
        socials: {
            github: "https://github.com/jashin019",
            linkedin: "https://www.linkedin.com/in/justin-baysa-794a11305/",
            twitter: "https://x.com/bays48745"
        }
    },
    {
        id: 2,
        name: "Clarence James V. Santiago",
        role: "UI/UX Designer",
        image: "assets/images/cj.jpg",
        shortDesc: "Crafting beautiful, intuitive interfaces for gamers.",
        longDesc: "CJ is the creative force behind NanoNexus's stunning visuals. They believe that great design is invisible, seamlessly guiding users to what they need. Their expertise in color theory and typography brings the premium feel to life.",
        skills: [
            { name: "Figma & Prototyping", level: 98 },
            { name: "Visual Design", level: 90 },
            { name: "User Testing", level: 80 }
        ],
        socials: {
            github: "https://github.com/santiagoclarencejames24-jpg",
            linkedin: "http://www.linkedin.com/in/clarence-james-santiago-525259260",
            twitter: "#"
        }
    },
    {
        id: 3,
        name: "John Kirby S. Tolentino",
        role: "Backend Engineer",
        image: "assets/images/kirby.jpg",
        shortDesc: "The architect of our databases and server infrastructure.",
        longDesc: "Kirby ensures that NanoNexus is fast, secure, and reliable. They handle the complex server-side logic and database management, ensuring that every transaction and user action is processed flawlessly.",
        skills: [
            { name: "Database Management", level: 92 },
            { name: "API Architecture", level: 88 },
            { name: "Security", level: 85 }
        ],
        socials: {
            github: "https://github.com/kirby270",
            linkedin: "https://www.linkedin.com/me?trk=p_mwlite_feed-secondary_nav",
            twitter: "https://x.com/JohnKirby169580?s=20"
        }
    },
    {
        id: 4,
        name: "Feirke Delos Santos",
        role: "Marketing Director",
        image: "assets/images/feirke.jpg",
        shortDesc: "Connecting our amazing products with the people who need them.",
        longDesc: "Feirke is the voice of NanoNexus. They craft our messaging, manage campaigns, and build our community. Their strategic mind helps us reach new audiences and grow our brand presence across all platforms.",
        skills: [
            { name: "Digital Marketing", level: 90 },
            { name: "Content Strategy", level: 85 },
            { name: "Community Building", level: 88 }
        ],
        socials: {
            github: "https://github.com/feirkedelossantos6-ops",
            linkedin: "https://www.linkedin.com/in/feirke-delos-santos-317935407?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
            twitter: "https://x.com/jFeirkeDelo3q"
        }
    },
    {
        id: 5,
        name: "Peter Cydrick N. Edem",
        role: "Product Specialist",
        image: "assets/images/peter.jpg",
        shortDesc: "Ensuring we only offer the highest quality tech gear.",
        longDesc: "Peter is our resident gearhead. They test and curate every product that goes onto NanoNexus. Their deep knowledge of hardware specs ensures that our customers always get the best value and performance.",
        skills: [
            { name: "Hardware Analysis", level: 95 },
            { name: "Quality Assurance", level: 90 },
            { name: "Customer Support", level: 85 }
        ],
        socials: {
            github: "https://github.com/petercydrickedem-rgb",
            linkedin: "https://www.linkedin.com/in/peter-cydrick-edem-05488a407?utm_source=share_via&utm_content=profile&utm_medium=member_android",
            twitter: "https://x.com/PeterEdemkun"
        }
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const teamGrid = document.getElementById("teamGrid");
    const modalOverlay = document.getElementById("memberModal");
    const modalBody = document.getElementById("modalBody");
    const closeModalBtn = document.getElementById("closeModal");

    function renderTeam() {
        teamMembers.forEach((member, index) => {
            const card = document.createElement("div");
            card.className = "member-card";
            card.style.transitionDelay = `${index * 100}ms`;

            card.innerHTML = `
                <img src="${member.image}" alt="${member.name}">
                <h3>${member.name}</h3>
                <h4>${member.role}</h4>
                <p>${member.shortDesc}</p>
                <button class="view-more-btn">View Profile</button>
            `;

            // If this is John Kirby (id === 3) navigate to Kirby.html on click
            // If this is Justin Baysa (id === 1) navigate to justin.html on click
            if (member.id === 3) {
                card.addEventListener("click", () => {
                    window.location.href = 'Kirby.html';
                });
            } else if( member.id === 2){
                card.addEventListener("click", () =>{
                    window.location.href = "Clarence.html";
                });
            }
            } else if (member.id === 1) {
                card.addEventListener("click", () => {
                    window.location.href = 'justin.html';
                });
            } else {
                card.addEventListener("click", () => openModal(member));
            }

            teamGrid.appendChild(card);
        });
    }

    function openModal(member) {
        let skillsHtml = '';
        member.skills.forEach(skill => {
            skillsHtml += `
                <div class="skill-bar">
                    <div class="skill-name">
                        <span>${skill.name}</span>
                        <span>${skill.level}%</span>
                    </div>
                    <div class="skill-track">
                        <div class="skill-fill" data-width="${skill.level}%"></div>
                    </div>
                </div>
            `;
        });

        modalBody.innerHTML = `
            <div class="modal-left">
                <img src="${member.image}" alt="${member.name}">
                <div class="social-links">
                    <a href="${member.socials.github}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>
                    <a href="${member.socials.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>
                    <a href="${member.socials.twitter}" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a>
                </div>
            </div>
            <div class="modal-right">
                <h3>${member.name}</h3>
                <h4>${member.role}</h4>
                <p>${member.longDesc}</p>
                <div class="skills-section">
                    <h5>Expertise</h5>
                    ${skillsHtml}
                </div>
            </div>
        `;

        modalOverlay.classList.add("active");

        setTimeout(() => {
            const skillFills = modalBody.querySelectorAll('.skill-fill');
            skillFills.forEach(fill => {
                fill.style.width = fill.getAttribute('data-width');
            });
        }, 100);
    }

    function closeModal() {
        modalOverlay.classList.remove("active");
        setTimeout(() => {
            const skillFills = modalBody.querySelectorAll('.skill-fill');
            skillFills.forEach(fill => {
                fill.style.width = '0';
            });
        }, 300);
    }

    closeModalBtn.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    function setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const cards = document.querySelectorAll('.member-card');
        cards.forEach(card => observer.observe(card));
    }

    renderTeam();
    setTimeout(setupScrollAnimations, 100);
});
