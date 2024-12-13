import React from 'react';
import { useLocation } from 'react-router-dom';

const Breadcrumbs: React.FC = () => {
    const location = useLocation();

    return (
        <>
            <div className="container-fluid breadcrumbs-container">
                <div className="row">
                    <div className="col g-0">
                        <span><a href="/" className="btn-simple">Home</a> <i className="fa-solid fa-chevron-right"></i> <a href={location.pathname} className="btn-simple">{breadcrumb}</a></span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Breadcrumbs;
