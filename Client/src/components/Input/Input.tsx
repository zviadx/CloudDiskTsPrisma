
// import PropTypes from 'prop-types';


const Input = (props) => {
    return (
        <div>
            <input
                className="relative w-[250px] border-t-0 border-b-[3px] border-b-black
                outline-none bg-transparent hover:scale-[1.03] "
                type={props.type}
                placeholder={props.placeholder}
                onChange={(e) => props.setMail(e.target.value)}
                value={props.mail}
            />
        </div>
    );
};

// Input.propTypes = {
//     type: PropTypes.string.isRequired,
//     placeholder: PropTypes.string,
//     setMail: PropTypes.func.isRequired,
//     mail: PropTypes.string.isRequired,
// };


export default Input;

