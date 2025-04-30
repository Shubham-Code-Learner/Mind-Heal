const FeatureCard = ({ title, color, icon }) => (
    <div className="feat" style={{ '--feature-color': color }}>
        <div className="feat-icon" style={{ backgroundColor: `${color}15` }}>
            {icon}
        </div>
        <div className="feat-text">{title}</div>
        <div className="feat-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    </div>
);

const FeatureCards = () => {
    const features = [
        {
            title: "Stress less",
            color: "#FFB800",
            icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 8L24 16M16 24L8 16" stroke="#FFB800" strokeWidth="3" strokeLinecap="round"/>
                </svg>
            )
        },
        {
            title: "Sleep soundly",
            color: "#9747FF",
            icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="10" stroke="#9747FF" strokeWidth="3"/>
                    <circle cx="16" cy="16" r="4" fill="#9747FF"/>
                </svg>
            )
        },
        {
            title: "Manage anxiety",
            color: "#2B9BF4",
            icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="10" stroke="#2B9BF4" strokeWidth="3" strokeDasharray="4 4"/>
                </svg>
            )
        },
        {
            title: "Text a coach",
            color: "#2B9BF4",
            icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="6" y="8" width="20" height="16" rx="2" stroke="#2B9BF4" strokeWidth="3"/>
                    <circle cx="11" cy="16" r="2" fill="#2B9BF4"/>
                    <circle cx="16" cy="16" r="2" fill="#2B9BF4"/>
                    <circle cx="21" cy="16" r="2" fill="#2B9BF4"/>
                </svg>
            )
        },
        {
            title: "Practice meditation",
            color: "#FF8A00",
            icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="10" stroke="#FF8A00" strokeWidth="3"/>
                </svg>
            )
        },
        {
            title: "Care for your team",
            color: "#FF4FB0",
            icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="6" y="18" width="20" height="6" rx="1" fill="#FF4FB0" fillOpacity="0.3" stroke="#FF4FB0" strokeWidth="3"/>
                    <rect x="6" y="8" width="20" height="6" rx="1" fill="#FF4FB0" fillOpacity="0.3" stroke="#FF4FB0" strokeWidth="3"/>
                </svg>
            )
        }
    ];

    return (
        <section className="features-section">
            <h2>What kind of headspace are you looking for?</h2>
            <div className="feat-container">
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </div>
        </section>
    );
};

export default FeatureCards; 