document.addEventListener("DOMContentLoaded", () => {
    // Function to handle scroll animations
    const setupScrollAnimations = () => {
        const sections = document.querySelectorAll("section");

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("section-visible");
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the section is visible
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    };

    // Fetch data and populate the page
    fetch("portfolio_data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Header
            document.title = data.title;
            document.querySelector("header h1").textContent = data.title;
            document.querySelector("header p").textContent = `최종 업데이트: ${data.lastUpdated}`;

            // Profile
            const profileSection = document.getElementById("profile");
            const profileContent = `
                <div class="profile-body">
                    <div class="profile-text">
                        <p><strong>이름:</strong> ${data.profile.name}</p>
                        <p><strong>이메일:</strong> <a href="mailto:${data.profile.email}">${data.profile.email}</a></p>
                        <p><strong>GitHub:</strong> <a href="https://github.com/${data.profile.github}" target="_blank">github.com/${data.profile.github}</a></p>
                    </div>
                    <img src="${data.profile.image}" alt="프로필 사진" class="profile-pic">
                </div>
            `;
            profileSection.insertAdjacentHTML('beforeend', profileContent);

            // Introduce
            const introduceSection = document.getElementById("introduce");
            // Preserve line breaks from JSON
            const introduceContent = data.introduce.split('\n\n').map(paragraph => 
                `<p>${paragraph.replace(/\n/g, '<br>')}</p>`
            ).join('');
            introduceSection.insertAdjacentHTML('beforeend', introduceContent);

            // Skills
            const skillsSection = document.getElementById("skills");
            const skillsContent = `
                <div class="skills-grid">
                    <div class="skill-category">
                        <h3>Frameworks & Libraries</h3>
                        <ul>${data.skills.frameworks_libraries.map(skill => `<li>${skill}</li>`).join('')}</ul>
                    </div>
                    <div class="skill-category">
                        <h3>Tools & IDEs</h3>
                        <ul>${data.skills.tools_ides.map(skill => `<li>${skill}</li>`).join('')}</ul>
                    </div>
                    <div class="skill-category">
                        <h3>Languages</h3>
                        <ul>${data.skills.languages.map(skill => `<li>${skill}</li>`).join('')}</ul>
                    </div>
                    <div class="skill-category">
                        <h3>Infrastructure & Databases</h3>
                        <ul>${data.skills.infrastructure_databases.map(skill => `<li>${skill}</li>`).join('')}</ul>
                    </div>
                </div>
            `;
            skillsSection.insertAdjacentHTML('beforeend', skillsContent);

            // Experience
            const experienceSection = document.getElementById("experience");
            let experienceContent = '';
            data.experience.forEach(item => {
                experienceContent += `
                    <div class="experience-item">
                        <h3>${item.company}</h3>
                        <p><strong>${item.period}</strong> | ${item.role}</p>
                        ${item.description ? `<h4>${item.description}</h4>` : ''}
                        ${item.details && item.details.length > 0 ? 
                            `<ul>
                                ${item.details.map(detail => `<li>${detail}</li>`).join('')}
                            </ul>` : ''
                        }
                    </div>
                `;
            });
            experienceSection.insertAdjacentHTML('beforeend', experienceContent);

            // Projects
            const projectsSection = document.getElementById("projects");
            let projectsContent = '';
            data.projects.forEach(item => {
                projectsContent += `
                    <div class="project-item">
                        <h3>${item.name}</h3>
                        <p><strong>프로젝트 요약:</strong> ${item.summary}</p>
                        <p><strong>담당 역할:</strong> ${item.role}</p>
                        <p><strong>주요 활동 및 성과:</strong></p>
                        <ul>
                            ${item.achievements.map(achieve => `<li>${achieve}</li>`).join('')}
                        </ul>
                        <p><strong>사용 기술:</strong><br>${Object.entries(item.techStack).map(([category, skills]) => `<strong>${category}:</strong> ${skills}`).join('<br>')}</p>
                        ${item.link.url ? `<p><a href="${item.link.url}" target="_blank">${item.link.name || item.link.url}</a></p>` : ''}
                    </div>
                `;
            });
            projectsSection.insertAdjacentHTML('beforeend', projectsContent);

            // Education
            const educationSection = document.getElementById("education");
            let educationContent = '';
            data.education.forEach(item => {
                educationContent += `
                    <div class="education-item">
                        <h3>${item.school}</h3>
                        <p><strong>${item.major}</strong> | ${item.period}</p>
                        ${item.details && item.details.length > 0 ? 
                            `<ul>${item.details.map(detail => `<li>${detail}</li>`).join('')}</ul>` : ''
                        }
                    </div>
                `;
            });
            educationSection.insertAdjacentHTML('beforeend', educationContent);

            // Contact
            const contactSection = document.getElementById("contact");
            const contactContent = `
                <p>언제든지 편하게 연락주세요.</p>
                <p><strong>이메일:</strong> <a href="mailto:${data.contact.email}">${data.contact.email}</a></p>
            `;
            contactSection.insertAdjacentHTML('beforeend', contactContent);

            // Footer
            document.querySelector("footer p").textContent = `© ${new Date().getFullYear()} ${data.footer.copyright}. All rights reserved.`;

            // After populating the data, set up the animations and navigation
            setupScrollAnimations();
            setupScrollNav();
        })
        .catch(error => console.error("Error fetching or processing portfolio data:", error));

    // Function to set up scroll-to-top navigation
    const setupScrollNav = () => {
        const nav = document.getElementById("scroll-nav");
        const sections = document.querySelectorAll("main section[id]");

        sections.forEach(section => {
            const link = document.createElement("a");
            link.href = `#${section.id}`;
            link.textContent = section.querySelector("h2").textContent;
            nav.appendChild(link);
        });

        // Highlight active link on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll("#scroll-nav a").forEach(a => a.classList.remove("active"));
                    const activeLink = document.querySelector(`#scroll-nav a[href="#${entry.target.id}"]`);
                    if (activeLink) {
                        activeLink.classList.add("active");
                    }
                }
            });
        }, { rootMargin: "-50% 0px -50% 0px" });

        sections.forEach(section => {
            observer.observe(section);
        });
    };
});