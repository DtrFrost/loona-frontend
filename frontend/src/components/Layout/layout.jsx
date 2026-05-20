import './layout.css'

export default function Layout({children}) {
    return(
        <div className="layout">
            <div className="layout__container">
                {children}
            </div>
        </div>
    )
};