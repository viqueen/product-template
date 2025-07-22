package api_todo_v1

import (
	"context"
	"errors"
	"fmt"

	"connectrpc.com/connect"
	"github.com/gofrs/uuid"
	todoV1 "github.com/viqueen/product-template/api/go-sdk/todo/v1"
	"github.com/viqueen/product-template/backend/internal/store"
	"gorm.io/gorm"
)

var (
	errTodoIDRequired = errors.New("todo id is required")
	errInvalidTodoID  = errors.New("invalid todo id format")
	errTodoNotFound   = errors.New("todo not found")
)

func (s *todoService) UpdateTodo(
	ctx context.Context,
	req *connect.Request[todoV1.UpdateTodoRequest],
) (*connect.Response[todoV1.UpdateTodoResponse], error) {
	msg := req.Msg

	// Validate request
	if msg.GetId() == "" {
		return nil, connect.NewError(connect.CodeInvalidArgument, errTodoIDRequired)
	}

	// Parse UUID
	todoID, err := uuid.FromString(msg.GetId())
	if err != nil {
		return nil, connect.NewError(
			connect.CodeInvalidArgument,
			fmt.Errorf("%w: %w", errInvalidTodoID, err),
		)
	}

	// Get existing todo
	existingTodo, err := s.repo.GetByID(ctx, todoID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, connect.NewError(connect.CodeNotFound, errTodoNotFound)
		}

		return nil, connect.NewError(connect.CodeInternal, err)
	}

	// Apply updates
	s.applyUpdates(existingTodo, msg)

	// Save updated todo
	if err := s.repo.Update(ctx, existingTodo); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	// Convert to proto response
	response := &todoV1.UpdateTodoResponse{
		Todo: dbTodoToAPI(existingTodo),
	}

	return connect.NewResponse(response), nil
}

func (s *todoService) applyUpdates(todo *store.Todo, msg *todoV1.UpdateTodoRequest) {
	updateMask := msg.GetUpdateMask()
	todoUpdate := msg.GetTodo()

	if todoUpdate == nil {
		return
	}

	// Apply updates based on field mask
	if updateMask != nil && len(updateMask.GetPaths()) > 0 {
		// Update only specified fields
		for _, path := range updateMask.GetPaths() {
			switch path {
			case "description":
				todo.Description = todoUpdate.GetDescription()
			case "status":
				todo.Status = int32(todoUpdate.GetStatus())
			}
		}
	} else {
		// If no field mask provided, update all provided fields
		todo.Description = todoUpdate.GetDescription()
		todo.Status = int32(todoUpdate.GetStatus())
	}
}
