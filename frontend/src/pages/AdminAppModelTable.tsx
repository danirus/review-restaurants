import React from 'react';
import {
  lighten, makeStyles, Theme, createStyles
} from '@material-ui/core/styles';
import clsx from 'clsx';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, Toolbar, Typography,  Checkbox, IconButton,
  Tooltip
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';


import { IField } from '../Ifaces.d';


interface EnhancedTableProps {
  headCells: IField[] | undefined;
  allSelected: boolean;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  totalCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, allSelected, totalCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            // indeterminate={numSelected > 0 && numSelected < totalCount}
            checked={totalCount > 0 && allSelected}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all' }}
          />
        </TableCell>
        {props.headCells && props.headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


const useToolbarStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight: theme.palette.type === 'light'
    ? {
      color: theme.palette.secondary.main,
      backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    }
    : {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.secondary.dark,
    },
  title: {
    flex: '1 1 100%'
  },
}));

interface EnhancedTableToolbarProps {
  title: string;
  numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title} color="inherit"
          variant="subtitle1" component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title} variant="h6"
          id="tableTitle" component="div"
        >
          {props.title}
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton arial-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton arial-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}


const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    width: '100%',
    marginBottom: theme.spacing(5)
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  }
}));

interface IProps {
  name: string;
  fields: IField[];
  page: number;
  rowsPerPage: number;
  totalCount: number;
  rows: {[x: string]: string | number}[];
  onChangePage: (event: unknown, newPage: number) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AdminAppModelTable(props: IProps) {
  const classes = useStyles();
  const [selected, setSelected] = React.useState<(string | number)[]>([]);
  const [allSelected, setAllSelected] = React.useState<boolean>(false);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const firstFieldName = props.fields[0].id;
      const newSelected = props.rows.map((n) => n[firstFieldName]);
      setSelected(newSelected);
      setAllSelected(true);
      return;
    }
    setAllSelected(false);
    setSelected([]);
  }

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: (string | number)[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }

    setSelected(newSelected);
  }

  const isSelected = (val: string | number) => selected.indexOf(val) !== -1;

  const noMoreRows = (
    props.rows.length + (props.page * props.rowsPerPage) === props.totalCount
  );

  return (
    <div className={classes.root}>
      <EnhancedTableToolbar
        title={`List of ${props.name}`}
        numSelected={allSelected ? props.totalCount : selected.length}
      />
        <TableContainer>
          <Table className={classes.table} size="small">
            <EnhancedTableHead
              headCells={props.fields}
              allSelected={allSelected}
              onSelectAllClick={handleSelectAllClick}
              totalCount={props.totalCount}
            />
            <TableBody>
              {props.rows.map((row, rIdx) => {
                const firstFieldName = props.fields[0].id;
                const isItemSelected = isSelected(row[firstFieldName]);
                const labelId = `enhanced-table-checkbox-${rIdx}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => {
                      handleClick(event, row[firstFieldName] as string)
                    }}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={`row-${rIdx}`}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    {props.fields.map((item: IField, cIdx: number) => {
                      if (cIdx === 0)
                        return (
                          <TableCell
                            component="th" id={labelId}
                            scope="row" padding="none"
                            key={`row-${rIdx}-cell-${cIdx}`}
                          >
                            {item.monospaceFont ? (
                              <span style={{ fontFamily: "monospace" }}>
                                {`${row[item.id]}`}
                              </span>) : `${row[item.id]}`
                            }
                          </TableCell>
                        );
                      else
                        return (
                          <TableCell
                            align={item.align}
                            key={`row-${rIdx}-cell-${cIdx}`}
                          >
                            {item.monospaceFont ? (
                              <span style={{ fontFamily: "monospace" }}>
                                {`${row[item.id]}`}
                              </span>) : `${row[item.id]}`
                            }
                          </TableCell>
                        );
                    })}
                  </TableRow>
                );
              })}
              {noMoreRows && (
                <TableRow style={{ height: 1 }}>
                  <TableCell colSpan={6} style={{
                    backgroundColor: "#aaa",
                    padding: 1
                  }} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={props.totalCount}
          rowsPerPage={props.rowsPerPage}
          page={props.page}
          onPageChange={props.onChangePage}
          onRowsPerPageChange={props.onChangeRowsPerPage}
        />
    </div>
  );
}