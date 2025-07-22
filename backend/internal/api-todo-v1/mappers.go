package api_todo_v1

import (
	"errors"
	"fmt"

	"connectrpc.com/connect"
	todoV1 "github.com/viqueen/product-template/api/go-sdk/todo/v1"
	"github.com/viqueen/product-template/backend/internal/store"
	"gorm.io/gorm"
)

func dbErrorToAPI(err error, msg string) *connect.Error {
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return connect.NewError(connect.CodeNotFound, err)
	}

	return connect.NewError(connect.CodeInternal, fmt.Errorf("%s: %w", msg, err))
}

func dbTodoToAPI(todo *store.Todo) *todoV1.Todo {
	return &todoV1.Todo{
		Id:          todo.ID.String(),
		Description: todo.Description,
	}
}

func nonZeroOrDefaultInt32(i int32, def int32) int32 {
	if i == 0 {
		return def
	}

	return i
}
