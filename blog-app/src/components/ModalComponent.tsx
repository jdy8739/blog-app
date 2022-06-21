import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { Button, Modal, ModalBg } from '../Styles/style';
import { modalVariant } from '../util/variants';

interface IModalComponent {
	isModalShown: boolean;
	setIsModalShown: (value: boolean) => void;
	action: () => void;
	sentence: string;
}

function ModalComponent({
	isModalShown,
	setIsModalShown,
	action,
	sentence,
}: IModalComponent) {
	const doAction = () => {
		action();
		setIsModalShown(false);
	};

	const stopProg = (e: React.MouseEvent<HTMLDivElement>) =>
		e.stopPropagation();

	return (
		<AnimatePresence>
			{isModalShown && (
				<ModalBg
					variants={modalVariant}
					initial="initial"
					animate="animate"
					exit="exit"
					onClick={() => setIsModalShown(false)}
				>
					<Modal width={300} onClick={stopProg}>
						<p style={{ paddingTop: '55px' }}>{sentence}</p>
						<Button onClick={doAction}>Yes</Button>
						<Button onClick={() => setIsModalShown(false)}>
							No
						</Button>
					</Modal>
				</ModalBg>
			)}
		</AnimatePresence>
	);
}

export default ModalComponent;
