import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default ({ open, handleClose, currentDetail }) => {
  const classes = useStyles();
  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
				<div>
					<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
						<CancelIcon />
					</IconButton>
					<div dangerouslySetInnerHTML={{__html: currentDetail}} />;
				</div>
				
      </Dialog>
    </div>
  );
}