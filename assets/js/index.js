import { EMPLOYEES } from '../data/data.js'

const listEmployees = structuredClone(EMPLOYEES);
let listRender = [];
const selectPerPage = document.querySelector('.selectPerPage');
const getPerPage = () => {
    return selectPerPage.value;
}

// No search result

const noSearch = `<div class="noSearch">
<div class="noSearch__content "></div>
<div class="noSearch__text">Không tìm thấy data cần tìm</div>
</div>`;
const rightNoData = document.querySelector('.content__right--noData');
rightNoData.innerHTML = noSearch;

const memberList = document.querySelector('.content__right__member-list');
const render = (arr) => {
    memberList.innerHTML = '';
    arr.forEach((employee) => {
        const member = document.createElement('div');
        member.classList.add('member');
        let employeeName = employee.name.split(' ');
        const firstWord = employeeName[employeeName.length - 1].slice(0, 1);
        member.innerHTML = (
            `
                            <div class="member__image">
                                <div class="member__avatar">
                                    <div class = 'employeeImg'>${firstWord}</div>
                                </div>
                                <div class="member__icons">
                                    <div class="member__icons-left" title="Messages">
                                        <i class="fa-solid fa-comments"></i>
                                        <span>20</span>
                                    </div>
                                    <div class="member__icons-right" title="Followers">
                                        <i class="fa-solid fa-users"></i>
                                        <span>20</span>
                                    </div>
                                </div>
                            </div>
                            <div class="member__detail">
                                <div class="member__info">
                                    <div class="member__name">
                                        <p>${employee.name}</p>
                                    </div>
                                    <div class="member__position">
                                        <li>${employee.job}</li>
                                    </div>
                                    <div class="member__email">
                                        <div class="member__email-icon">
                                            <i class="fa-solid fa-envelope"></i>
                                        </div>
                                        <div class="member__email-name">
                                            <p>${employee.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="member__btn"><button>Follow</button></div>
                            </div>
            `
        )
        memberList.append(member);
    })
}
// pagination ===================================================================
const btnNext = document.querySelector('.btn__next');
const btnPrev = document.querySelector('.btn__prev');
// let perPage = 40;
let currentPage = 1;
let start = 0;
let end = getPerPage();
// let totalPage = Math.ceil(listEmployees.length / perPage);
render([...listEmployees.slice(start, end)]);


const getCurrentPage = (currentPage, perPage) => {
    start = (currentPage - 1) * perPage;
    end = currentPage * perPage;
}

const renderListPage = (arr, perPage) => {
    let totalPage = Math.ceil(arr.length / perPage);
    let pagItem = document.querySelector('.pagination');
    let html = ` <li class="pagination-item">
    <a href="" class="pagination-item__link">Page ${currentPage}/${totalPage}</a>
</li>`;
    for (let i = 2; i <= totalPage; i++) {
        html = ` <li class="pagination-item">
    <a href="" class="pagination-item__link">Page ${currentPage}/${totalPage}</a>
</li>`;
    }
    pagItem.innerHTML = html;

    if (currentPage === totalPage) {
        document.querySelector('.btn__next').setAttribute('style', 'opacity : 0.5;cursor : not-allowed');
        document.querySelector('.btn__prev').setAttribute('style', 'opacity : 1;cursor : pointer');
    } else if (currentPage <= 1) {
        document.querySelector('.btn__prev').setAttribute('style', 'opacity : 0.5;cursor : not-allowed');
        document.querySelector('.btn__next').setAttribute('style', 'opacity : 1;cursor : pointer');
    } else {
        document.querySelector('.btn__prev').setAttribute('style', 'opacity : 1;cursor : pointer');
        document.querySelector('.btn__next').setAttribute('style', 'opacity : 1;cursor : pointer')
    }
    // console.log(currentPage, totalPage);
}
renderListPage(listEmployees, getPerPage());


const renderIncrease = (arr, perPage) => {
    let totalPage = Math.ceil(arr.length / perPage);
    currentPage++;
    if (currentPage > totalPage) {
        currentPage = totalPage;
    }
    getCurrentPage(currentPage, getPerPage());
    listRender = [...arr.slice(start, end)]
    render(listRender);
    renderListPage(arr, getPerPage());
}


const renderDecrease = (arr) => {
    currentPage--;
    if (currentPage <= 1) {
        currentPage = 1;
    }
    getCurrentPage(currentPage, getPerPage());
    listRender = [...arr.slice(start, end)]
    render(listRender);
    renderListPage(arr, getPerPage());
}

btnNext.onclick = () => { renderIncrease(listEmployees, getPerPage()); }
btnPrev.onclick = () => { renderDecrease(listEmployees, getPerPage()) }
// change perPage

const changePerPage = (arr) => {
    currentPage = 1;
    getCurrentPage(1, getPerPage());
    render(arr.slice(start, end));
    renderListPage(arr, getPerPage());
}
selectPerPage.onchange = () => { changePerPage(listEmployees) }

// Search =======================================================================

const plusSearch = document.querySelector('.fa-magnifying-glass-plus');
const minusSearch = document.querySelector('.fa-magnifying-glass-minus')
const btnFilter = document.querySelector('.btn__filter');
const iconSearch = document.querySelector('.icon-search');
let count = true;
iconSearch.onclick = () => {
    if (count) {
        minusSearch.setAttribute('style', 'display : block');
        plusSearch.setAttribute('style', 'display:none');
        btnFilter.classList.add('visible');
        count = false;
    } else {
        minusSearch.setAttribute('style', 'display : none');
        plusSearch.setAttribute('style', 'display:block');
        btnFilter.classList.remove('visible');
        count = true
    }

}




const btnSort = document.querySelector('.btn__filter--sort');
const filterSubnav = document.querySelector('.filter__subnav');
btnSort.onclick = () => {
    filterSubnav.classList.toggle('block');
}

// const formCreateEmp = document.querySelector('.modal__create');
const btnAdd = document.querySelector('.btn__add > button')
let isModalOpen = false;


//  create email =============================================================
const convertNonAccented = (str) => {
    str = str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
    return str
}

const createNameEmail = (name) => {
    const splitName = name.split(' ');
    if (splitName.length <= 1) {
        return convertNonAccented(`${splitName[splitName.length - 1]}`);
    }
    return convertNonAccented(`${splitName[splitName.length - 1]}.${splitName[0]}`);
}



const findNumberMax = (arr) => {
    let maxNumber = arr[0];
    if (!arr.length) {
        return ''
    } else {
        arr.forEach((number) => {
            if (maxNumber < number) {
                maxNumber = number
            }
        })
        return +maxNumber
    }
}

// console.log(createNameEmail('Đặng Thị Mỹ Linh'));
const createEmail = (name) => {
    const emailRoot = '@ntq-solution.com.vn';
    const regex = /[^0-9]/g;
    let employeeSplitName = createNameEmail(name);
    const equivalentName = [];
    const arrNumber = [];
    EMPLOYEES.forEach((employee) => {
        const employeeEmail = employee.email.match(/^(.+)@/)[1].match(regex).join('');
        let matchesNumber = employee.email.match(/^(.+)@/)[1].match(/(\d+)/);
        if (employeeSplitName === employeeEmail) {
            if (matchesNumber !== null) {
                arrNumber.push(matchesNumber[0]);
            }
            equivalentName.push(employeeEmail);
        }
    })
    if (!equivalentName.length) {
        return employeeSplitName + emailRoot;
    } else {
        let emailNumber = findNumberMax(arrNumber) + 1;
        // console.log(employeeSplitName, emailNumber, emailRoot);
        return employeeSplitName + emailNumber + emailRoot;
    }
}

// console.log(createEmail('Nguyễn Hoàng Hải'));
const createId = () => {
    let maxId = listEmployees[0].id;
    EMPLOYEES.forEach((employee) => {
        if (maxId < employee.id) {
            maxId = employee.id;
        }
    })
    return maxId + 1;
};

// console.log(listEmployees.length);

const handleAddEmployee = (arr, nameVal, jobVal, emailVal, idVal) => {
    let inputName = document.querySelector(`.${nameVal}`).value;
    let inputJob = document.querySelector(`.${jobVal}`).value;

    if (!inputJob || !inputName) {
        alert('You must fill out information ! Please try again !');
    } else {
        if (document.querySelector(`.${emailVal}`).value === "" ||
            document.querySelector(`.${idVal}`).value === "") {
            alert('You must wait');
            showErrorToast();
            return;
        } else {
            arr.unshift({
                id: createId(),
                name: inputName,
                email: createEmail(inputName),
                job: inputJob
            })
            // console.log(listEmployees.length);
            // console.log(EMPLOYEES);
            render([...arr.slice(start, end)]);
            showSuccessToast();
        }
        if (isModalOpen) {
            closeModal();
        }
    }
    // console.log(inputName);
    document.querySelector(`.${nameVal}`).value = "";
    document.querySelector(`.${emailVal}`).value = "";
    document.querySelector(`.${idVal}`).value = ""
}


btnAdd.onclick = (event) => {
    event.preventDefault();
    handleAddEmployee(EMPLOYEES, 'input_name', 'input_job', 'input_email', 'input_id');
}

// add employee
const modal = document.querySelector('.modal');
const open__modal = document.querySelector(".open__modal button");
const title__icon = document.querySelector(".title__icon");
const bg__big = document.querySelector('.bg--big');
const btn_addEmployee = document.querySelector('.btn__addEmployee');

const closeModal = () => {
    isModalOpen = false;
    modal.setAttribute('style', "display : none");
    bg__big.setAttribute('style', "display : none");
}

const openModal = () => {
    isModalOpen = true;
    modal.setAttribute('style', "display : block");
    bg__big.setAttribute('style', "display : block");
}

title__icon.onclick = () => {
    closeModal()
}
open__modal.onclick = () => {
    openModal()
}

bg__big.onclick = () => {
    closeModal();
}
modal.onclick = (e) => {
    e.stopPropagation();
}

btn_addEmployee.onclick = () => {
    handleAddEmployee(EMPLOYEES, 'modal_name', 'modal_job', 'modal_email', 'modal_id');
}
const keyUpName = (emailVal, idVal, inputRoot) => {
    const inputEmail = document.querySelector(`.${emailVal}`);
    const inputId = document.querySelector(`.${idVal}`);
    if (inputRoot.value) {
        inputEmail.value = createEmail(inputRoot.value);
        inputId.value = createId();
    } else {
        inputEmail.value = '';
        inputId.value = '';
    }
}
const modalName = document.querySelector('.modal_name');
modalName.onkeyup = () => { keyUpName('modal_email', 'modal_id', modalName); }

// On blur email input==============================================


const inputName = document.querySelector('.input_name');
inputName.onkeyup = () => { keyUpName('input_email', 'input_id', inputName); };

// Toast message
const toast = ({ title = "", message = "", type = "success", duration = 3000 }) => {
    const main = document.getElementById("toast");
    if (main) {
        const toast = document.createElement("div");

        // Auto remove toast
        const autoRemoveId = setTimeout(function () {
            main.removeChild(toast);
        }, duration + 1000);

        // Remove toast when clicked
        toast.onclick = function (e) {
            if (e.target.closest(".toast__close")) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        };

        const icons = {
            success: "fas fa-check-circle",
            error: "fas fa-exclamation-circle"
        };
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);

        toast.classList.add("toast", `toast--${type}`);
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

        toast.innerHTML = `
                      <div class="toast__icon">
                          <i class="${icon}"></i>
                      </div>
                      <div class="toast__body">
                          <h3 class="toast__title">${title}</h3>
                          <p class="toast__msg">${message}</p>
                      </div>
                      <div class="toast__close">
                          <i class="fas fa-times"></i>
                      </div>
                  `;
        main.appendChild(toast);
    }
}

const showSuccessToast = () => {
    toast({
        title: "Thành công!",
        message: "Bạn đã thêm nhân viên thành công .",
        type: "success",
        duration: 5000
    });
}

const showErrorToast = () => {
    toast({
        title: "Thất bại!",
        message: "Có lỗi xảy ra, vui lòng thử lại .",
        type: "error",
        duration: 5000
    });
}
// Find by Name , Email===========================================================

const searchInput = document.querySelector('.search__input');
const searchByName = (searchName) => {
    const listResult = listEmployees.filter((employee) => {
        if (employee.name.includes(searchName)) {
            return true;
        }
    })
    return listResult;
}

// console.log(searchByName('Nam'));
const search = (searchValue) => {
    const listResult = EMPLOYEES.filter((employee) => {
        if (employee.name.toLowerCase().includes(searchValue.toLowerCase()) || employee.email.includes(searchValue.toLowerCase()) || employee.job.toLowerCase().includes(searchValue.toLowerCase())) {
            return true;
        }
    })
    return listResult;
}
// Search by Email

const searchByEmail = (email) => {
    const listResult = EMPLOYEES.filter((employee) => {
        const employeeEmail = employee.email ? employee.email.match(/^(.+)@/)[1] : '';
        if (employee.email ? employee.email.includes(email) : null || employee.email ? employee.email.includes(employeeEmail) : null) {
            return true;
        }
    })
    return listResult;
}

// console.log(searchByEmail("duy.do"));
// console.log(searchByName("Duy"));
const dropDown = document.querySelector('.dropDown');
searchInput.addEventListener('keyup', (e) => {
    if (e.keyCode !== 13) {
        dropDown.setAttribute('style', 'display : block');
    }
    if (!e.target.value) {
        dropDown.setAttribute('style', 'display : none')
    }

});


let findName = document.querySelector('.findByName');
let findEmail = document.querySelector('.findByEmail');
findName.onclick = () => {
    if (searchByName(searchInput.value).length) {
        currentPage = 1;
        getCurrentPage(1, getPerPage());
        changePerPage(searchByName(searchInput.value))
        selectPerPage.onchange = () => { changePerPage(searchByName(searchInput.value)) }
        sortByName(searchByName(searchInput.value));
        sortByNameReverse(searchByName(searchInput.value));
        dropDown.setAttribute('style', 'display : none');
        btnNext.onclick = () => { renderIncrease(searchByName(searchInput.value), getPerPage()); }
        btnPrev.onclick = () => { renderDecrease(searchByName(searchInput.value), getPerPage()) };
        memberList.setAttribute('style', 'display : grid');
        rightNoData.setAttribute('style', 'display : none');
        btnAZ.onclick = () => {
            sortName(searchByName(searchInput.value))
        }

        btnZA.onclick = () => {
            sortNameReverse(searchByName(searchInput.value))
        }

    } else {
        rightNoData.setAttribute('style', 'display : block');
        dropDown.setAttribute('style', 'display : none');
        memberList.setAttribute('style', 'display : none');
    }

}
findEmail.onclick = () => {
    if (searchByEmail(searchInput.value).length) {
        currentPage = 1;
        getCurrentPage(1, getPerPage());
        changePerPage(searchByEmail(searchInput.value))
        selectPerPage.onchange = () => { changePerPage(searchByEmail(searchInput.value)) }
        sortByName(searchByEmail(searchInput.value));
        sortByNameReverse(searchByEmail(searchInput.value));
        dropDown.setAttribute('style', 'display : none');
        btnNext.onclick = () => { renderIncrease(searchByEmail(searchInput.value), getPerPage()) }
        btnPrev.onclick = () => { renderDecrease(searchByEmail(searchInput.value), getPerPage()) }
        memberList.setAttribute('style', 'display : grid');
        rightNoData.setAttribute('style', 'display : none');
        btnAZ.onclick = () => {
            sortName(searchByEmail(searchInput.value))
        }

        btnZA.onclick = () => {
            sortNameReverse(searchByEmail(searchInput.value))
        }

    } else {
        rightNoData.setAttribute('style', 'display : block');
        dropDown.setAttribute('style', 'display : none');
        memberList.setAttribute('style', 'display : none');
    }

}

searchInput.onkeypress = (e) => {
    if (e.keyCode == 13) {
        if (search(e.target.value).length) {
            currentPage = 1;
            getCurrentPage(1, getPerPage());

            changePerPage(search(e.target.value))
            selectPerPage.onchange = () => { changePerPage(search(e.target.value)) }
            sortByName(search(e.target.value));
            sortByNameReverse(search(e.target.value));
            dropDown.setAttribute('style', 'display : none');
            btnNext.onclick = () => { renderIncrease(search(e.target.value), getPerPage()); }
            btnPrev.onclick = () => { renderDecrease(search(e.target.value), getPerPage()) };
            btnAZ.onclick = () => {
                sortName(search(e.target.value));
            }

            btnZA.onclick = () => {
                sortNameReverse(search(e.target.value))
            }

            memberList.setAttribute('style', 'display : grid');
            rightNoData.setAttribute('style', 'display : none');
        } else {
            rightNoData.setAttribute('style', 'display : block');
            dropDown.setAttribute('style', 'display : none');
            memberList.setAttribute('style', 'display : none');
        }

    }
}

// Filter ==============================================================

const sortByName = (arr) => {
    let result = arr.sort((after, before) => {
        return after.name.split(' ')[after.name.split(' ').length - 1].localeCompare(before.name.split(' ')[before.name.split(' ').length - 1])
    })
    return result;
}

const sortByNameReverse = (arr) => {
    let result = arr.sort((after, before) => {
        return before.name.split(' ')[before.name.split(' ').length - 1].localeCompare(after.name.split(' ')[after.name.split(' ').length - 1])
    })
    return result;
}

const btnAZ = document.querySelector('.btnAZ');
const btnZA = document.querySelector('.btnZA');

const sortName = (arr) => {
    render([...sortByName(arr).slice(start, end)]);
    filterSubnav.classList.remove('block');
    btnNext.onclick = () => { renderIncrease(arr, getPerPage()) }
    btnPrev.onclick = () => { renderDecrease(arr, getPerPage()) }
}

const sortNameReverse = (arr) => {
    render([...sortByNameReverse(arr).slice(start, end)]);
    filterSubnav.classList.remove('block')
    btnNext.onclick = () => { renderIncrease(arr, getPerPage()) }
    btnPrev.onclick = () => { renderDecrease(arr, getPerPage()) }
}
btnAZ.onclick = () => {
    sortName(listEmployees)
}

btnZA.onclick = () => {
    sortNameReverse(listEmployees)
}

