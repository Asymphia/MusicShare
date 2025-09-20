import {Link} from "react-router-dom";

interface SeeAllButtonProps {
    link: string
}

const SeeAllButton = ({ link }: SeeAllButtonProps) => {
    return (
        <Link to={ link } className="text-primary-60 font-text xl:text-s md:text-xs text-2xs transition cursor-pointer hover:text-primary-80 active:text-primary">
            See all...
        </Link>
    )
}

export default SeeAllButton