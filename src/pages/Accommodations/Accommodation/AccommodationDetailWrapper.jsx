import { useParams } from "react-router-dom";
import { useState, useRef, useLayoutEffect } from "react";
import Accommodation from "./Accommodation.jsx";
import SidebarNav from "./SidebarNav.jsx";

function AccommodationDetailWrapper() {
    const { id } = useParams();
    const [activeSection, setActiveSection] = useState(null);
    const sectionRefs = useRef({});

    const scrollToSection = (id) => {
        const section = sectionRefs.current[id];
        if (section) {
            const yOffset = -80; // header height offset
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    useLayoutEffect(() => {
        const setInitialActiveSection = () => {
            const sections = sectionRefs.current;
            const viewportHeight = window.innerHeight;
            let closestDistance = Infinity;
            let closestId = null;

            Object.entries(sections).forEach(([id, el]) => {
                const target = el?.current || el;
                if (!target) return;
                const rect = target.getBoundingClientRect();
                const headerOffset = window.innerWidth < 768 ? 0 : 80; // 모바일은 0, 데스크탑은 80px
                const sectionCenter = rect.top + rect.height / 2 - headerOffset;
                const distanceToViewportCenter = Math.abs(viewportHeight / 2 - sectionCenter);
                if (distanceToViewportCenter < closestDistance) {
                    closestDistance = distanceToViewportCenter;
                    closestId = id;
                }
            });

            if (closestId) setActiveSection(closestId);
        };

        // Initial activeSection on mount
        setInitialActiveSection();

        const observer = new IntersectionObserver(
            (entries) => {
                const viewportHeight = window.innerHeight;
                let closestDistance = Infinity;
                let closestId = null;

                entries.forEach((entry) => {
                    const rect = entry.target.getBoundingClientRect();
                    const headerOffset = window.innerWidth < 768 ? 0 : 80; // 모바일은 0, 데스크탑은 80px
                    const sectionCenter = rect.top + rect.height / 2 - headerOffset;
                    const distanceToViewportCenter = Math.abs(viewportHeight / 2 - sectionCenter);

                    if (distanceToViewportCenter < closestDistance) {
                        closestDistance = distanceToViewportCenter;
                        closestId = entry.target.dataset.id || entry.target.id;
                    }
                });

                if (closestId) setActiveSection(closestId);
            },
            {
                threshold: [0.25, 0.5, 0.75],
                rootMargin: "-80px 0px -40% 0px",
            }
        );

        Object.values(sectionRefs.current).forEach((ref) => {
            const target = ref?.current || ref;
            if (target) observer.observe(target);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
            <div className="hidden md:flex md:w-40 shrink-0 md:sticky md:top-20">
                <SidebarNav activeSection={activeSection} onScrollTo={scrollToSection} />
            </div>
            <div className="flex-1 min-w-0 mt-4 md:mt-0">
                <Accommodation accommodationId={id} sectionRefs={sectionRefs} />
            </div>
        </div>
    );
}

export default AccommodationDetailWrapper;