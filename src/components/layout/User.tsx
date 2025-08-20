import placeholder from "../../assets/placeholders/placeholder-image.jpg"

const User = () => {
    return (
        <div className="space-y-2">
            <img src={placeholder} alt="User profile picture" className="w-17 h-17"/>
            <p className="font-text text-primary text-s">
                <span className="text-accent-2">Logged as:</span> <br />
                super_user123
            </p>
        </div>


    )
}

export default User