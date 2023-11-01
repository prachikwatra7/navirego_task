import "./App.css";
import Checkbox from "./components/Checkbox/Checkbox";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

// Type of the ListItem Rendered
interface CheckboxType {
  id: number;
  checked: boolean;
  values?: any[];
}

// Main Function
function App() {
  // This is the default Array at the initial phase
  const checkboxArray = useMemo(() => {
    return [
      { id: 0, checked: false, values: [] },
      { id: 1, checked: false, values: [] },
      { id: 2, checked: false, values: [] },
      { id: 3, checked: false, values: [] },
      { id: 4, checked: false, values: [] },
      { id: 5, checked: false, values: [] },
      { id: 6, checked: false, values: [] },
    ];
  }, []);

  // Required states
  const [checkboxValues, setCheckboxValues] = useState(checkboxArray);
  const [displayingList, setDisplayingList] = useState<CheckboxType[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetching API
  const fetchAPIData = useCallback(
    async (checkbox_number: number) => {
      return axios
        .get(
          `https://navirego-interview-mc3narrsb-volodymyr-matselyukh.vercel.app/api/letters/${checkbox_number}`
        )
        .then((data) => {
          if (data?.data?.letter)
            setDisplayingList(
              displayingList?.map((value) => {
                return {
                  ...value,
                  values:
                    value?.id === checkbox_number
                      ? //@ts-ignore
                        [...value?.values, data?.data?.letter]
                      : value?.values,
                };
              })
            );
          return JSON.stringify(data?.data?.letter);
        })
        .catch((error) => {
          console.log(error);
          setErrorMessage(error?.message);
        });
    },
    [displayingList]
  );

  // This useEffect is to have API calls at every 2 seconds
  useEffect(() => {
    setTimeout(() => {
      checkboxValues?.map((value) => {
        if (value?.checked) fetchAPIData(value?.id);
      });
    }, 2000);
  }, [checkboxValues, fetchAPIData]);

  // This useEffect is to sync the checkbox array with the displaying components list
  useEffect(() => {
    if (
      displayingList?.length !==
      checkboxValues?.filter((value) => value?.checked)?.length
    )
      setDisplayingList(checkboxValues?.filter((value) => value?.checked));
  }, [checkboxValues, displayingList?.length]);

  // This useEffect is for the Error Message showcase and to clear them after 2sec
  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setErrorMessage(""), 2000);
    }
  }, [errorMessage]);

  // This is the callback method that is called whenever we are toggling the checkbox
  const handleChange = useCallback(
    (index: number) => {
      setCheckboxValues(
        checkboxValues?.map((value) => {
          if (value?.id === index) {
            if (!value?.checked) {
              setDisplayingList([
                ...displayingList,
                { ...value, checked: true },
              ]);
            } else {
              setDisplayingList(
                displayingList?.filter((value) => {
                  return value?.id !== index;
                })
              );
            }
          }
          return {
            ...value,
            checked: value?.id === index ? !value?.checked : value?.checked,
          };
        })
      );
    },
    [checkboxValues, displayingList]
  );

  // Rendered Elements
  return (
    <div>
      {errorMessage && <div className="errorMessage">{errorMessage}</div>}
      <div className="checkbox">
        {checkboxValues?.map((value) => {
          return (
            <Checkbox
              key={value?.id}
              checked={value?.checked}
              onChange={() => handleChange(value?.id)}
              label={`Checkbox number : ${value?.id + 1}`}
            />
          );
        })}
      </div>
      {displayingList?.length > 0 && (
        <div className="displayList">
          <div>
            <div className="displayList__heading">Displaying List</div>
            {displayingList?.map((value) => (
              <div key={value?.id} className="displayList__itemContainer">
                <div>
                  {`Checkbox number : ${value?.id + 1}`}
                  <br />
                  <div
                    key={value?.id}
                    className="displayList__itemContainer__list"
                  >
                    {value?.values?.map((item: string) => {
                      return <div>{`${item}`}</div>;
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
