import { groupBy } from "lodash";

export function getGroupedList(categories) {
    let groupCtegories = {};
    if (categories?.length) {
      const categoriesArr = groupBy(categories, item => item?.department?.title);
      Object.keys(categoriesArr).forEach(item => {
        categoriesArr[item].forEach((pItem, index) => {
          if (index === 0) {
            groupCtegories[item] = {
              department: pItem.department.title,
              products: []
            };
          }
          groupCtegories[item]?.products?.push(pItem);
        });
      });
    }

    groupCtegories = Object.values(groupCtegories);
    return groupCtegories;
  }

  export function groupFilters(deptFilters, locFilters, funcFilters) {
    let groupFilters = {};
    deptFilters.title = 'Department';
    locFilters.title = 'Location';
    funcFilters.title = 'Function';
    groupFilters = {
        departmentFilters: deptFilters, 
        locationFilters: locFilters, 
        functionFilters: funcFilters
      }
    return groupFilters;
  }