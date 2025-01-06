export const Footer = () => {
    return (
        <div className="container-fluid footer-parent">
            <footer className="container d-flex justify-content-center">
                <div className="row">
                    <div className="col-auto text-center">
                        <p>&copy; {new Date().getFullYear()} - OfficeCalendar.</p>
                        <p>Made by&nbsp;
                            <a className="btn-link" target="_blank" href="https://github.com/yassyass2">
                                Yassine
                            </a>,&nbsp;
                            <a className="btn-link" target="_blank" href="https://github.com/MauriceBoendermaker">
                                Maurice
                            </a>,&nbsp;
                            <a className="btn-link" target="_blank" href="https://github.com/Motje3">
                                Mohammad
                            </a>,&nbsp;
                            <a className="btn-link" target="_blank" href="https://github.com/herkam3">
                                Halit
                            </a>
                            &nbsp;en&nbsp;
                            <a className="btn-link" target="_blank" href="https://github.com/Thijs-1051036">
                                Thijs
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}