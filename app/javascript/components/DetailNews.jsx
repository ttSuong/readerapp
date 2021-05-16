import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default ({open, content, handleClose}) => {
	const classes = useStyles();
  return (
		<Dialog fullScreen keepMounted open={open} onClose={() => handleClose()} TransitionComponent={Transition}>
			<AppBar className={classes.appBar}>
				<Toolbar>
					<IconButton edge="start" color="inherit" onClick={() => handleClose()} aria-label="close">
						<CloseIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			{content ? <iframe src={content} height="100%" /> : <CircularProgress/> }
		</Dialog>
  );
}