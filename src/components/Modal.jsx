import { motion } from 'framer-motion';

function Modal({ message, onClose }) {
    return (
        <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
                <p className="text-gray-800 text-lg mb-4">{message}</p>
                <button
                    onClick={onClose}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-md"
                >
                    확인
                </button>
            </div>
        </motion.div>
    );
}

export default Modal;