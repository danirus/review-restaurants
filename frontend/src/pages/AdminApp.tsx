import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Box, Breadcrumbs, Container, Link, Typography
} from '@material-ui/core';

import { apps, resPerPage } from '../config';
import { apiCall, loadItems } from '../api';
import { StateCtx } from '../contexts';
import { IApp, IField, ILoadItems, IRestOp } from '../Ifaces';

import AdminAppModelTable from './AdminAppModelTable';


const styles = (theme: Theme) => createStyles({
  mwPanel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "flex-start",
    alignItems: "center"
  },
  mwBreadcrumbs: {
    margin: theme.spacing(1, 0),
    "& .MuiTypography-root": {
      fontSize: "0.9rem"
    }
  },
  mwMain: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
});

const useStyles = makeStyles(styles);

interface IUrlParams {
  app: string;
}

export default function AdminApp() {
  const classes = useStyles();
  let { app: appParam } = useParams() as IUrlParams;
  const { state, dispatch } = React.useContext(StateCtx);

  const [app, setApp] = React.useState<IApp | undefined>(undefined);
  const [opsMap, setOpsMap] = React.useState<Map<string, IRestOp>>(new Map());

  // Page (for the TablePagination at the bottom of AdminAppModelTable)
  // is a 0-based value.
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = React.useState<{[x: string]: string | number}[]>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(resPerPage);
  const [totalCount, setTotalCount] = React.useState<number>(-1);
  const [offset, setOffset] = React.useState<number>(0);

  React.useEffect(() => {
    const _app = apps.find((item: IApp) => item.id === appParam);
    if (_app && _app.ops !== undefined) {
      const _opsMap: Map<string, IRestOp> = new Map();
      _app.ops.forEach((op: IRestOp) => {
        _opsMap.set(op.name, op);
      });
      setOpsMap(_opsMap);
    }
    setApp(_app);
  }, [appParam]);

  React.useEffect(() => {
    setOffset(page * rowsPerPage);
    window.scrollTo(0, 0);
  }, [page, rowsPerPage, setOffset]);

  React.useEffect(() => {
    const do_load_items = async (endpoint: string) => {
      const _items: ILoadItems = await apiCall(
        state.access_token, state.refresh_token, dispatch,
        loadItems, offset, rowsPerPage, endpoint
      );
      if (_items) {
        setRows(_items.data);
        setTotalCount(_items.count);
      }
    }

    if (opsMap.has("list") && state.access_token && state.refresh_token) {
      const list_op: IRestOp = opsMap.get("list") as IRestOp;
      do_load_items(list_op.endpoint);
    }
  }, [
    state.access_token,
    state.refresh_token,
    offset,
    rowsPerPage,
    opsMap,
    dispatch
  ]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
    // Call to fetch function to list items.
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    // Call to fetch function to list items.
  }

  if (app === undefined)
    return <span />;

  return (
    <Box className={classes.mwPanel}>
      <Container component="main" className={classes.mwMain} maxWidth="sm">
        <Breadcrumbs className={classes.mwBreadcrumbs}>
          <Link color="inherit" component={RouterLink} to="/">Home</Link>
          <Link color="inherit" component={RouterLink} to="/admin">Admin</Link>
          <Typography color="textPrimary">{app.name}</Typography>
        </Breadcrumbs>
        <Typography variant="h3" gutterBottom>
          {app.name}
        </Typography>
      </Container>

      {opsMap.has("list") && (
        <Container maxWidth="md">
          <AdminAppModelTable
            name={app.name}
            fields={(opsMap.get("list") as IRestOp).fields as IField[]}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={totalCount}
            rows={rows}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Container>
      )}
    </Box>
  )
}
